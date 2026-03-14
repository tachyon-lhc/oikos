import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from pathlib import Path
import sqlite3
from xgboost import XGBRegressor
from sklearn.ensemble import GradientBoostingRegressor

DATABASE_PATH = Path(__file__).parent.parent / "database" / "propiedades.db"


def convertir_db_en_df(conn):
    query = """
        SELECT * FROM propiedades
    """
    df = pd.read_sql_query(query, conn)
    return df


def preprocess_data(df):
    """
    Preprocesa los datos del CSV
    """
    # Hacer una copia para no modificar el original
    df_processed = df.copy()

    df_processed = df_processed[
        (df_processed["precio"] >= 30000)
        & (df_processed["precio"] <= 1000000)
        & (df_processed["precio_por_m2"] >= 400)
        & (df_processed["precio_por_m2"] <= 4000)
    ]

    # Eliminar columnas que no usaremos
    if "id" in df_processed.columns:
        df_processed = df_processed.drop("id", axis=1)
    if "precio_por_m2" in df_processed.columns:
        df_processed = df_processed.drop("precio_por_m2", axis=1)

    # Eliminar filas con valores nulos
    df_processed = df_processed.dropna()

    # Codificar variables categóricas (zona y ciudad)
    le_zona = LabelEncoder()
    le_ciudad = LabelEncoder()

    df_processed["zona_encoded"] = le_zona.fit_transform(df_processed["zona"])
    df_processed["ciudad_encoded"] = le_ciudad.fit_transform(df_processed["ciudad"])

    # Eliminar las columnas originales de texto
    cols_a_eliminar = [
        "id",
        "precio_por_m2",
        "fecha_scraping",
        "fecha_creacion",
        "url",
        "zona",
        "ciudad",
    ]
    for col in cols_a_eliminar:
        if col in df_processed.columns:
            df_processed = df_processed.drop(col, axis=1)

    # Guardar los encoders para usarlos en predicción
    os.makedirs("src/models", exist_ok=True)
    joblib.dump(le_zona, "src/models/zona_encoder.pkl")
    joblib.dump(le_ciudad, "src/models/ciudad_encoder.pkl")

    print("\nEncoders guardados:")
    print(f"  Zonas: {list(le_zona.classes_)}")
    print(f"  Ciudades: {list(le_ciudad.classes_)}")

    return df_processed, le_zona, le_ciudad


def train_and_evaluate():
    """
    Entrena el modelo y muestra métricas de evaluación
    """
    print("Cargando datos...")
    """
    df = pd.read_csv(
        os.path.join(os.path.dirname(__file__), "..", "data", "housing.csv")
    )
    """
    conn = sqlite3.connect(DATABASE_PATH)
    df = convertir_db_en_df(conn)
    print(f"Dataset cargado: {df.shape[0]} filas, {df.shape[1]} columnas")
    print(f"\nPrimeras filas:\n{df.head()}")

    # Preprocesar
    print("\nPreprocesando datos...")
    df_processed, le_zona, le_ciudad = preprocess_data(df)

    # Separar features (X) y target (y)
    X = df_processed.drop("precio", axis=1)
    y = df_processed["precio"]

    print(f"\nFeatures: {list(X.columns)}")
    print("Target: precio")

    # Split train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"\nDatos de entrenamiento: {X_train.shape[0]}")
    print(f"Datos de prueba: {X_test.shape[0]}")

    # Entrenar modelo

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
    )
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
    model_path = "src/models/precio_model.pkl"
    joblib.dump(model, model_path)
    print(f"\n✓ Modelo guardado en: {model_path}")

    return model, le_zona, le_ciudad


if __name__ == "__main__":
    print("=" * 50)
    print("ENTRENAMIENTO DEL MODELO DE PREDICCIÓN DE PRECIOS")
    print("=" * 50)
    model, le_zona, le_ciudad = train_and_evaluate()
    print("\n¡Entrenamiento completado!")
