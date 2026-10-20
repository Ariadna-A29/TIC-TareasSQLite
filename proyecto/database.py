import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
load_dotenv()
URL = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
engine = create_engine(URL)
Session = sessionmaker(bind=engine)
Base = declarative_base()
if __name__ == "__main__":
    with engine.connect() as conexion:
        conexion.execute(text("SELECT 1"))
        print("Conexión exitosa")