from datetime import date
from sqlalchemy.orm import sessionmaker
from schema import engine, Profesor,Estudiante

Session = sessionmaker(bind=engine)
session = Session()

session = Session()

# 1. Profesores
profesores = [
    Profesor(nombre="Julian", apellido="Impelluso")
]
session.add_all(profesores)
session.commit()

# 2. Estudiantes
estudiantes= [
    Estudiante(nombre="Juan", apellido="Pérez", email="juan@mail.com", activo=True),
    Estudiante(nombre="Ana", apellido="Gómez", email="ana@mail.com", activo=True),
    Estudiante(nombre="Carlos", apellido="López", email="carlos@mail.com", activo=False),
    Estudiante(nombre="Lucía", apellido="Martínez", email="lucia@mail.com", activo=True),
    Estudiante(nombre="Diego", apellido="Fernández", email="diego@mail.com", activo=False),
    Estudiante(nombre="Sofia", apellido="Rodríguez", email="sofia@mail.com", activo=True),
    Estudiante(nombre="Mateo", apellido="Sánchez", email="mateo@mail.com", activo=True),
    Estudiante(nombre="Elena", apellido="Díaz", email="elena@mail.com", activo=False),
    Estudiante(nombre="Tomás", apellido="Álvarez", email="tomas@mail.com", activo=True),
    Estudiante(nombre="Camila", apellido="Torres", email="camila@mail.com", activo=True)
]
session.add_all(estudiantes)
session.commit()

session.close()

print("¡Base de datos cargada!")