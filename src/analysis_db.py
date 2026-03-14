from pathlib import Path
import sqlite3
import pandas as pd

DATABASE_PATH = Path(__file__).parent.parent / "database" / "propiedades.db"


def mostrar_info(conn):
    query = """
        SELECT * FROM propiedades
    """
    df = pd.read_sql_query(query, conn)
    print(df.head())
    print(len(df))
    print(df.info())


def analizar_precios(conn):
    query = "SELECT precio FROM propiedades"
    df = pd.read_sql_query(query, conn)
    print(df["precio"].describe())
    print(df["precio"].quantile([0.01, 0.25, 0.75, 0.99]))


def analizar_outliers(conn):
    query = "SELECT precio FROM propiedades"
    df = pd.read_sql_query(query, conn)
    print(f"Propiedades < $30k: {len(df[df['precio'] < 30000])}")
    print(f"Propiedades > $800k: {len(df[df['precio'] > 800000])}")
    print(f"Propiedades > $1M: {len(df[df['precio'] > 1000000])}")


def analizar_features(conn):
    query = "SELECT area, ambientes, bathrooms FROM propiedades"
    df = pd.read_sql_query(query, conn)
    print("AREA:")
    print(df["area"].describe())
    print("\nAMBIENTES:")
    print(df["ambientes"].describe())
    print("\nBAÑOS:")
    print(df["bathrooms"].describe())


def analizar_precio_por_m2(conn):
    query = "SELECT precio, area, precio_por_m2 FROM propiedades"
    df = pd.read_sql_query(query, conn)
    print("PRECIO POR M2:")
    print(df["precio_por_m2"].describe())
    print(df["precio_por_m2"].quantile([0.01, 0.05, 0.95, 0.99]))


def analizar_precio_m2_outliers(conn):
    query = "SELECT precio, area, precio_por_m2 FROM propiedades"
    df = pd.read_sql_query(query, conn)
    print(f"Propiedades < $400/m²: {len(df[df['precio_por_m2'] < 400])}")
    print(f"Propiedades > $4000/m²: {len(df[df['precio_por_m2'] > 4000])}")


def analizar_distribucion(conn):
    query = "SELECT zona, ciudad, COUNT(*) as cantidad FROM propiedades GROUP BY ciudad ORDER BY cantidad DESC"
    df = pd.read_sql_query(query, conn)
    print(df.to_string())


def main():
    conn = sqlite3.connect(DATABASE_PATH)
    # mostrar_info(conn)
    # analizar_precios(conn)
    # analizar_outliers(conn)
    # analizar_features(conn)
    # analizar_precio_por_m2(conn)
    # analizar_precio_m2_outliers(conn)
    analizar_distribucion(conn)


if __name__ == "__main__":
    main()
