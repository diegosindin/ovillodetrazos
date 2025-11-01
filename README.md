Ovillo de trazos - Proyecto final Full Stack Ambox 2025
Este es mi primer proyecto como programador *Full Stack*, desarrollado como trabajo final del curso.  
Decidí basarme en el ejemplo que vimos en la última clase, y a partir de ahí lo fui ampliando y adaptando para cumplir con todos los requerimientos, aunque reconozco que no planifiqué correctamente desde el inicio, lo que me llevó a tener que reestructurar varias partes del código en distintas ocasiones.

Fue un proceso de mucho aprendizaje, frustraciones, correcciones, pero también de satisfacción al ver cómo poco a poco el proyecto cobraba forma.

Instalacion: 
El proyecto esta dividido en backfinal y frontfinal, con Node, la base de datos con 
Mongo DB y esta cargado en Git Hub, por lo que se requiere tener git instalado.
En cuanto al front instalar las dependencias y ponerlo a correr.
Entidades principales : usuario, profesor  y curso.
En la pagina de inicio tenemos la opcion de registrarse o loguearse, luego tenemos en la barra del navbar la opcion de registrarse o ingresar directamente, con esta ultima tenemos la posibilidad de inscibirnos a los cursos. En otra parte, tenemos la opcion de crear cursos, seleccionando el profesor de la lista que esta cargada, y luego podemos ver los cursos, con su carga horaria, su cupos totales y disponibles para poder inscribirse. Los cursos tienen una lista de tag para poder distinguirse, que es la misma que aplica para filtrar los cursos que buscamos para poder inscribirnos.
Las principales rutas de las api son : 
/api/usuarios

POST /registro → registrar un nuevo usuario
POST /login → autenticar usuario
GET / → obtener lista de usuarios

/api/profesores

GET / → obtener todos los profesores
POST / → crear un nuevo profesor
PUT /:id → actualizar un profesor
DELETE /:id → eliminar un profesor

/api/cursos

GET / → obtener todos los cursos
POST / → crear curso
PUT /:id → actualizar curso
DELETE /:id → eliminar curso




 Repositorio en GitHub: [https://github.com/diegosindin/ovillodetrazos](https://github.com/diegosindin/ovillodetrazos)











