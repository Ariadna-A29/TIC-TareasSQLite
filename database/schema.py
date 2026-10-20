from sqlalchemy import create_engine, Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Profesor(Base):
    __tablename__ = "profesores"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)

class Estudiante(Base):
    __tablename__ = "estudiantes"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    email = Column(String, nullable=False)
    grupo = Column(String, nullable= False)

engine = create_engine("sqlite:///schema.db",
                       echo=True)

Base.metadata.create_all(engine)