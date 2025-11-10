from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import os
import sys

# Agregar directorio src al path para imports
sys.path.insert(0, os.path.dirname(__file__))
from data_utils import prepare_input

app = Flask(__name__, template_folder="../templates", static_folder="../static")
CORS(app)

# Cargar modelo al iniciar
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models/price_model.pkl")
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
    """Sirve el HTML principal"""
    return render_template("index.html")


@app.route("/api/status")
def status():
    """Endpoint para verificar que la API funciona"""
    return jsonify(
        {
            "status": "ok",
            "message": "API de predicción de precios de viviendas",
            "model_loaded": model is not None,
        }
    )


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("\n--- Nueva predicción ---")
        print(f"Datos recibidos: {data}")

        if model is None:
            return jsonify({"error": "Modelo no cargado"}), 500

        print("➡️ Preprocesando input...")
        X = prepare_input(data)
        print(f"✅ Features preparados: {list(X.columns)}")

        print("➡️ Ejecutando predicción...")
        prediction = model.predict(X)[0]
        print(f"✅ Predicción: ${prediction:,.2f}")

        return jsonify(
            {
                "predicted_price": float(prediction),
                "formatted_price": f"${prediction:,.2f}",
                "input_data": data,
            }
        )

    except Exception as e:
        import traceback

        print("❌ Error en predicción:")
        traceback.print_exc()  # imprime toda la traza
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    load_model()
    print("\n" + "=" * 50)
    print("Servidor Flask iniciado")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000)
