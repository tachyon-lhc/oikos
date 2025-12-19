from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import numpy as np
import os
import sys

# Agregar directorio src al path
sys.path.insert(0, os.path.dirname(__file__))

app = Flask(__name__, template_folder="../templates", static_folder="../static")
CORS(app)

# Usar ruta absoluta para el modelo y encoders
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "price_model.pkl")
ZONE_ENCODER_PATH = os.path.join(BASE_DIR, "models", "zone_encoder.pkl")
CITY_ENCODER_PATH = os.path.join(BASE_DIR, "models", "city_encoder.pkl")

model = None
le_zone = None
le_city = None


def load_model():
    global model, le_zone, le_city
    print("\n=== DEBUG INFO ===")
    print(f"BASE_DIR: {BASE_DIR}")
    print(f"MODEL_PATH: {MODEL_PATH}")
    print(f"ZONE_ENCODER_PATH: {ZONE_ENCODER_PATH}")
    print(f"CITY_ENCODER_PATH: {CITY_ENCODER_PATH}")

    # Listar archivos en la carpeta models
    models_dir = os.path.join(BASE_DIR, "models")
    if os.path.exists(models_dir):
        print(f"\nArchivos en {models_dir}:")
        print(os.listdir(models_dir))
    else:
        print(f"¡La carpeta {models_dir} NO EXISTE!")
        return

    # Cargar modelo
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print("✓ Modelo cargado correctamente")
        except Exception as e:
            print(f"✗ ERROR al cargar modelo: {e}")
    else:
        print(f"✗ ERROR: No se encontró el modelo en {MODEL_PATH}")

    # Cargar encoders
    if os.path.exists(ZONE_ENCODER_PATH):
        try:
            le_zone = joblib.load(ZONE_ENCODER_PATH)
            print(
                f"✓ Zone encoder cargado. Zonas disponibles: {list(le_zone.classes_)}"
            )
        except Exception as e:
            print(f"✗ ERROR al cargar zone encoder: {e}")
    else:
        print(f"✗ ERROR: No se encontró zone_encoder en {ZONE_ENCODER_PATH}")

    if os.path.exists(CITY_ENCODER_PATH):
        try:
            le_city = joblib.load(CITY_ENCODER_PATH)
            print(
                f"✓ City encoder cargado. Ciudades disponibles: {list(le_city.classes_)}"
            )
        except Exception as e:
            print(f"✗ ERROR al cargar city encoder: {e}")
    else:
        print(f"✗ ERROR: No se encontró city_encoder en {CITY_ENCODER_PATH}")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/status")
def status():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model is not None,
            "encoders_loaded": le_zone is not None and le_city is not None,
            "model_path": MODEL_PATH,
            "model_exists": os.path.exists(MODEL_PATH),
            "zones_available": list(le_zone.classes_) if le_zone else [],
            "cities_available": list(le_city.classes_) if le_city else [],
        }
    )


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("\n--- Nueva predicción ---")
        print(f"Datos recibidos: {data}")

        # Validar que el modelo y encoders estén cargados
        if model is None or le_zone is None or le_city is None:
            print("ERROR: Modelo o encoders no cargados")
            return jsonify({"error": "Modelo no cargado. Ver logs del servidor."}), 500

        # Extraer datos
        rooms = data.get("rooms", 0)
        bathrooms = data.get("bathrooms", 0)
        area = data.get("area", 0)
        region = data.get("region", "")
        localidad = data.get("localidad", "")

        # Validar datos obligatorios
        if not all([rooms, area, region, localidad]):
            return jsonify(
                {"error": "Faltan datos obligatorios: rooms, area, region, localidad"}
            ), 400

        print(f"Rooms: {rooms}, Bathrooms: {bathrooms}, Area: {area}")
        print(f"Region: {region}, Localidad: {localidad}")

        # Codificar zona y ciudad
        try:
            zone_encoded = le_zone.transform([region])[0]
            city_encoded = le_city.transform([localidad])[0]
            print(f"Zone encoded: {zone_encoded}, City encoded: {city_encoded}")
        except ValueError as e:
            available_zones = list(le_zone.classes_)
            available_cities = list(le_city.classes_)
            error_msg = f"Región o localidad no reconocida. Disponibles:\nZonas: {available_zones}\nCiudades: {available_cities}"
            print(f"ERROR: {error_msg}")
            return jsonify({"error": error_msg}), 400

        # Crear array de features en el orden correcto
        # [rooms, bathrooms, square_meters, zone_encoded, city_encoded]
        features = np.array([[rooms, bathrooms, area, zone_encoded, city_encoded]])
        print(f"Features para predicción: {features[0]}")

        # Hacer predicción
        prediction = model.predict(features)[0]
        print(f"Predicción: ${prediction:,.2f}")

        # Formatear precio
        formatted_price = f"${prediction:,.2f}"

        return jsonify(
            {
                "predicted_price": float(prediction),
                "formatted_price": formatted_price,
                "input_data": {
                    "rooms": rooms,
                    "bathrooms": bathrooms,
                    "area": area,
                    "region": region,
                    "localidad": localidad,
                },
            }
        )

    except Exception as e:
        print(f"Error en predicción: {str(e)}")
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    load_model()
    print("\n" + "=" * 50)
    print("Servidor Flask iniciado")
    print("Estado del modelo:", "✓ OK" if model else "✗ Error")
    print("Estado de encoders:", "✓ OK" if (le_zone and le_city) else "✗ Error")
    print("=" * 50)
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
else:
    # Cuando Gunicorn importa la app
    load_model()
