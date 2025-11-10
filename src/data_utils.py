import os
import pandas as pd


def load_data(filepath=None):
    """Carga el dataset del CSV de forma segura en local y en Render"""
    if filepath is None:
        # Ruta absoluta basada en la ubicación de este archivo
        base_dir = os.path.dirname(os.path.abspath(__file__))
        filepath = os.path.join(base_dir, "../data/Housing.csv")

    df = pd.read_csv(filepath)
    return df


def preprocess_data(df):
    """
    Preprocesa los datos:
    - Convierte booleanos a binarios
    - Codifica furnishingstatus
    - Separa features y target
    """
    df_processed = df.copy()

    # Convertir yes-no en 1-0
    yes_no_columns = [
        "mainroad",
        "guestroom",
        "basement",
        "hotwaterheating",
        "airconditioning",
        "prefarea",
    ]
    for col in yes_no_columns:
        df_processed[col] = df_processed[col].map({"yes": 1, "no": 0})

    # Codificar furnishingstatus (unfurnished=0, semi-furnished=1, furnished=2)
    furnishing_map = {"unfurnished": 0, "semi-furnished": 1, "furnished": 2}
    df_processed["furnishingstatus"] = df_processed["furnishingstatus"].map(
        furnishing_map
    )

    return df_processed


def prepare_input(json_data):
    """
    Convierte el JSON del frontend al formato que espera el modelo
    """
    # Crear dataframe con una fila
    df = pd.DataFrame([json_data])

    # Asegurarse de que yes/no se conviertan a 1/0
    yes_no_columns = [
        "mainroad",
        "guestroom",
        "basement",
        "hotwaterheating",
        "airconditioning",
        "prefarea",
    ]

    for col in yes_no_columns:
        if col in df.columns:
            df[col] = df[col].map({"yes": 1, "no": 0})

    # Codificar furnishingstatus
    furnishing_map = {"unfurnished": 0, "semi-furnished": 1, "furnished": 2}
    if "furnishingstatus" in df.columns:
        df["furnishingstatus"] = df["furnishingstatus"].map(furnishing_map)

    # Asegurarse del orden correcto de columnas
    feature_order = [
        "area",
        "bedrooms",
        "bathrooms",
        "stories",
        "mainroad",
        "guestroom",
        "basement",
        "hotwaterheating",
        "airconditioning",
        "parking",
        "prefarea",
        "furnishingstatus",
    ]

    return df[feature_order]
