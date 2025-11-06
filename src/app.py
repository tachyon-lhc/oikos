from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from data_utils import prepare_input

app = Flask(__name__)
CORS(app)  # Permitir requests desde tu frontend

# Cargar modelo al iniciar
MODEL_PATH = "src/models/price_model.pkl"
model = None


def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"✓ Modelo cargado desde {MODEL_PATH}")
    else:
        print(f"✗ ERROR: No se encontró el modelo en {MODEL_PATH}")
        print("   Ejecuta 'python src/train_model.py' primero")


@app.route("/")
def home():
    return jsonify(
        {
            "status": "ok",
            "message": "API de predicción de precios de viviendas",
            "endpoints": {"/predict": "POST - Envía JSON con datos de la casa"},
        }
    )


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Obtener JSON del request
        data = request.get_json()

        print("\n--- Nueva predicción ---")
        print(f"Datos recibidos: {data}")

        # Validar que el modelo esté cargado
        if model is None:
            return jsonify(
                {"error": "Modelo no cargado. Ejecuta train_model.py primero"}
            ), 500

        # Preprocesar input
        X = prepare_input(data)
        print(f"Features preparados: {X.values[0]}")

        # Hacer predicción
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
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    load_model()
    print("\n" + "=" * 50)
    print("Servidor Flask iniciado")
    print("=" * 50)
    app.run(debug=True, port=5000)
