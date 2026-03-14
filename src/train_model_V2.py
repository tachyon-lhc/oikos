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

DATABASE_PATH = Path(__file__).parent.parent / "database" / "propiedades.db"
MODELS_PATH = Path(__file__).parent / "models"


def convertir_db_en_df(conn):
    query = "SELECT * FROM propiedades"
    df = pd.read_sql_query(query, conn)
    return df


def filtrar_outliers(df):
    return df[
        (df["precio"] >= 30000)
        & (df["precio"] <= 1000000)
        & (df["precio_por_m2"] >= 400)
        & (df["precio_por_m2"] <= 4000)
    ]


def agregar_features(df):
    df = df.copy()
    df["ambientes_por_m2"] = df["ambientes"] / df["area"]
    df["baños_por_ambiente"] = df["bathrooms"] / df["ambientes"]
    return df


def limpiar_columnas(df):
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
        if col in df.columns:
            df = df.drop(col, axis=1)
    return df


def entrenar_modelo(X_train, y_train):
    model = RandomForestRegressor(
        n_estimators=50,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)
    return model


def evaluar_modelo(model, X_test, y_test, nombre=""):
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    print(f"  [{nombre}] MAE: ${mae:,.2f} | RMSE: ${rmse:,.2f} | R²: {r2:.4f}")
    return r2


def entrenar_modelo_general(df):
    print("\n=== MODELO GENERAL ===")
    df_proc = filtrar_outliers(df)
    df_proc = agregar_features(df_proc)
    df_proc = df_proc.dropna()

    le_zona = LabelEncoder()
    le_ciudad = LabelEncoder()
    df_proc["zona_encoded"] = le_zona.fit_transform(df_proc["zona"])
    df_proc["ciudad_encoded"] = le_ciudad.fit_transform(df_proc["ciudad"])

    df_proc = limpiar_columnas(df_proc)

    X = df_proc.drop("precio", axis=1)
    y = df_proc["precio"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    model = entrenar_modelo(X_train, y_train)
    evaluar_modelo(model, X_test, y_test, "General")

    MODELS_PATH.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODELS_PATH / "modelo_general.pkl")
    joblib.dump(le_zona, MODELS_PATH / "zona_encoder.pkl")
    joblib.dump(le_ciudad, MODELS_PATH / "ciudad_encoder.pkl")
    print("  ✓ Modelo general guardado")

    return model


def train_and_evaluate():
    print("Cargando datos...")
    conn = sqlite3.connect(DATABASE_PATH)
    df = convertir_db_en_df(conn)
    conn.close()
    print(f"Dataset cargado: {df.shape[0]} filas, {df.shape[1]} columnas")
    entrenar_modelo_general(df)


if __name__ == "__main__":
    print("=" * 50)
    print("ENTRENAMIENTO V2 — MODELO GENERAL CON FEATURES EXTENDIDAS")
    print("=" * 50)
    train_and_evaluate()
    print("\n¡Entrenamiento completado!")
