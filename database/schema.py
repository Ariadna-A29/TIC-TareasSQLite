from sqlalchemy import create_engine, Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

Base = declarative_base()

class Profesor(Base):
    __tablename__ = "profesores"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)

    grupos = relationship("Grupo", back_populates="profesor")

class Estudiante(Base):
    __tablename__ = "estudiantes"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    grupo_id = Column(Integer,ForeignKey("grupos.id"))

    grupo = relationship("Grupo", back_populates="estudiantes")
    reservas = relationship("Reserva", back_populates="estudiante")

class Grupo(Base):
    __tablename__ = "grupos"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    profesor_id = Column(Integer, ForeignKey("profesores.id"))

    profesor = relationship("Profesor", back_populates="grupos")
    alumnos = relationship("Estudiante", back_populates="grupo")

class Tarea(Base):
    __tablename__ = "tareas"

    id = Column(Integer, primary_key=True)
    titulo = Column(String, nullable=False)
    descripcion = Column(String)
    requisitos = Column(String)
    estado = Column(String, default="Pendiente")

reservas= relationship("Reserva", back_populates="tarea")

class Reserva(Base):
    __tablename__ = "reservas"
 
    id = Column(Integer, primary_key=True)
    alumno_id = Column(String, ForeignKey("estudiantes.id"))
    tarea_id = Column(String, ForeignKey("tareas.id"))

alumno= relationship("Estudiante", back_populates="reservas")
tarea= relationship("Tarea", back_populates="tarea")
     
engine = create_engine("sqlite:///schema.db",
                       echo=True)

Base.metadata.create_all(engine)