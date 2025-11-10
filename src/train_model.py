import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os
from data_utils import load_data, preprocess_data


def train_and_evaluate():
    """
    Entrena el modelo y muestra métricas de evaluación
    """
    print("Cargando datos...")
    df = pd.read_csv(
        os.path.join(os.path.dirname(__file__), "..", "data", "Housing.csv")
    )

    print(f"Dataset cargado: {df.shape[0]} filas, {df.shape[1]} columnas")
    print(f"\nPrimeras filas:\n{df.head()}")

    # Preprocesar
    print("\nPreprocesando datos...")
    df_processed = preprocess_data(df)

    # Separar features (X) y target (y)
    X = df_processed.drop("price", axis=1)
    y = df_processed["price"]

    print(f"\nFeatures: {list(X.columns)}")
    print("Target: price")

    # Split train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print(f"\nDatos de entrenamiento: {X_train.shape[0]}")
    print(f"Datos de prueba: {X_test.shape[0]}")

    # Entrenar modelo (puedes probar ambos y elegir el mejor)
    print("\n--- Entrenando Random Forest ---")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluar
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print("\nMétricas del modelo:")
    print(f"  MAE (Error Absoluto Medio): ${mae:,.2f}")
    print(f"  RMSE (Raíz del Error Cuadrático Medio): ${rmse:,.2f}")
    print(f"  R² (Coeficiente de determinación): {r2:.4f}")

    # Mostrar importancia de features
    feature_importance = pd.DataFrame(
        {"feature": X.columns, "importance": model.feature_importances_}
    ).sort_values("importance", ascending=False)

    print("\nImportancia de features:")
    print(feature_importance.to_string(index=False))

    # Guardar modelo
    os.makedirs("src/models", exist_ok=True)
    model_path = "src/models/price_model.pkl"
    joblib.dump(model, model_path)
    print(f"\n✓ Modelo guardado en: {model_path}")

    return model


if __name__ == "__main__":
    print("=" * 50)
    print("ENTRENAMIENTO DEL MODELO DE PREDICCIÓN DE PRECIOS")
    print("=" * 50)
    model = train_and_evaluate()
    print("\n¡Entrenamiento completado!")
