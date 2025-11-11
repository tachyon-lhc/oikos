from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import os
import sys

# Agregar directorio src al path
sys.path.insert(0, os.path.dirname(__file__))
from data_utils import prepare_input

app = Flask(__name__, template_folder="../templates", static_folder="../static")
CORS(app)

# Usar ruta absoluta para el modelo
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "price_model.pkl")
model = None


def load_model():
    global model

    print("\n=== DEBUG INFO ===")
    print(f"BASE_DIR: {BASE_DIR}")
    print(f"MODEL_PATH: {MODEL_PATH}")
    print(f"¿Existe el archivo?: {os.path.exists(MODEL_PATH)}")

    # Listar archivos en la carpeta models
    models_dir = os.path.join(BASE_DIR, "models")
    if os.path.exists(models_dir):
        print(f"Archivos en {models_dir}:")
        print(os.listdir(models_dir))
    else:
        print(f"¡La carpeta {models_dir} NO EXISTE!")

    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print("✓ Modelo cargado correctamente")
        except Exception as e:
            print(f"✗ ERROR al cargar modelo: {e}")
    else:
        print(f"✗ ERROR: No se encontró el modelo en {MODEL_PATH}")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/status")
def status():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model is not None,
            "model_path": MODEL_PATH,
            "model_exists": os.path.exists(MODEL_PATH),
        }
    )


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        print("\n--- Nueva predicción ---")
        print(f"Datos recibidos: {data}")

        if model is None:
            print("ERROR: Modelo no cargado")
            return jsonify({"error": "Modelo no cargado. Ver logs del servidor."}), 500

        X = prepare_input(data)
        print(f"Features preparados: {X.values[0]}")

        prediction = model.predict(X)[0]
        print(f"Predicción: ${prediction:,.2f}")

        return jsonify(
            {
                "predicted_price": float(prediction),
                "formatted_price": f"${prediction:,.2f}",
                "input_data": data,
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
    print("=" * 50)
    app.run(debug=True, port=5000)
else:
    # Cuando Gunicorn importa la app
    load_model()
