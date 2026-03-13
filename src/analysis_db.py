from pathlib import Path
import sqlite3
import pandas as pd

DATABASE_PATH = Path("__file__").parent.parent / "database" / "propiedades.db"


def mostrar_info(conn):
    query = """
        SELECT * FROM propiedades
    """
    df = pd.read_sql_query(query, conn)
    print(df.head())
    print(len(df))
    print(df.info())


def main():
    conn = sqlite3.connect(DATABASE_PATH)
    mostrar_info(conn)


if __name__ == "__main__":
    main()
