from datetime import date
from sqlalchemy.orm import sessionmaker
from schema import engine, Profesor,Estudiante, Grupo, Tarea, Reserva

Session = sessionmaker(bind=engine)
session = Session()

session = Session()

# 1. Profesores
profesores = [
    Profesor(profesor_id= "1",nombre="Julian", apellido="Impelluso")
]
session.add_all(profesores)
session.commit()

# 2. Estudiantes
estudiantes= [
    Estudiante(nombre="Angela Norma Rojas Tinoco", grupo_id= 4, activo=True),
    Estudiante(nombre="Lautaro Uriel Ulunque",grupo_id= 4, activo=True),
    Estudiante(nombre="Benjamin Vega", grupo_id= 4, activo=True),
    Estudiante(nombre="Griselda Keyla Villa Quispe", grupo_id= 4, activo=True),
    Estudiante(nombre="Nelida Zutara", grupo_id= 4 , activo=True)
]
session.add_all(estudiantes)
session.commit()

#3. Grupos
grupos= [
    Grupo(id="1", nombre="3B-G1", plataforma="PC", profesor_id="1"),
    Grupo(id="2", nombre="3B-G2", plataforma="PC", profesor_id="1"),
    Grupo(id="3", nombre="3D-G1", plataforma="PC", profesor_id="1"),
    Grupo(id="4", nombre="3D-G2", plataforma="PC", profesor_id="1"),
    Grupo(id="5", nombre="4B", plataforma="PC", profesor_id="1"),
    Grupo(id="6", nombre="4D", plataforma="PC", profesor_id="1")
]
session.add_all(grupos)
session.commit()

#4. Tareas
tareas= [
    Tarea(id="1", codigo="1.3", titulo="Salto estilo ovni del Geometry Dash", descripcion="Quiero que el avatar se impulse un poco hacia arriba cada vez que se presiona una tecla de salto, y caiga lentamente cuando no se aprieta la tecla", puntos="2"),
    Tarea(id="2", codigo="1.14", titulo="Tecla de prueba para ignorar colisiones", descripcion="Para probar el juego, quiero tener una tecla para desactivar o reactivar las colisiones del avatar contra el mapa",  puntos="1"),
    Tarea(id="3", codigo="1.22", titulo="Avance de a tiles constante tipo Snake", descripcion="Quiero que el avatar se avance tile a tile de forma constante, y poder cambiar en qué dirección avanza usando las flechas",  puntos="1"),
    Tarea(id="4", codigo="2.5", titulo="Tiles mortales al correr o caminar", descripcion="Quiero que el avatar se impulse un poco hacia arriba cada vez que se presiona una tecla de salto, y caiga lentamente cuando no se aprieta la tecla", puntos="1"),
    Tarea(id="5", codigo="3.6", titulo="Guardián de la llave", descripcion="Quiero que, cuando el avatar tome la llave para poder avanzar, un obstáculo o enemigo que antes estaba quieto empiece a moverse y perseguirlo", puntos="1"),
    Tarea(id="6", codigo="3.13", titulo="Enemigo que escapa del avatar, respetando paredes", descripcion="Quiero que un enemigo, en vez de perseguir al avatar, se escape siempre de él, respetando las paredes del nivel", puntos="1"),
    Tarea(id="7", codigo="4.2", titulo="Mejora temporal del avatar", descripcion=" Quiero tener power-ups que mejoren las capacidades del avatar por un tiempo limitado, y luego le quiten la mejora", puntos="1"),
    Tarea(id="8", codigo="4.5", titulo=" Objeto curativo consumible", descripcion="Quiero que el avatar pueda recolectar un objeto curativo para recuperar energía perdida.", puntos="1"),
    Tarea(id="9", codigo="4.9", titulo="Objeto de extensión de tiempo de juego", descripcion="Quiero que el avatar pueda recolectar objetos para tener más tiempo antes de que termine el juego", puntos="1"),
    Tarea(id="10", codigo="4.14", titulo="Objeto recolectable múltiple usando tiles", descripcion=" Quiero que el avatar pueda recolectar cualquier cantidad de objetos especiales ubicados en el mapa", puntos="1")
]
session.add_all([profesores, grupos, estudiantes, tareas])
session.commit()

#5. Reservas
reserva= Reserva(
    estudiantes_id=estudiantes.id,
    tareas_id= tareas.id
)
session.add_all(reserva)
session.commit()

session.close()

print("¡Base de datos cargada!")