import Curso from "../models/curso.js";

/* =====================================================
   📘 OBTENER TODOS LOS CURSOS (con profesor y alumnos)
===================================================== */
export const obtenerCursos = async (req, res) => {
  try {
    const cursos = await Curso.find()
      .populate("profesor", "nombre apellido nombre_completo")
      .populate("alumnos", "nombre apellido email");

    res.json(cursos);
  } catch (error) {
    console.error("❌ Error al obtener cursos:", error);
    res.status(500).json({
      message: "Error al obtener cursos",
      error: error.message,
    });
  }
};

/* =====================================================
   ➕ CREAR NUEVO CURSO
===================================================== */
export const crearCurso = async (req, res) => {
  try {
    const nuevoCurso = new Curso({
      ...req.body,
      inscriptos: 0, // al crear siempre empieza con 0
    });

    await nuevoCurso.save();
    res.status(201).json(nuevoCurso);
  } catch (error) {
    console.error("❌ Error al crear curso:", error);
    res.status(400).json({
      message: "Error al crear el curso",
      error: error.message,
    });
  }
};

/* =====================================================
   ✏️ ACTUALIZAR CURSO
===================================================== */
export const actualizarCurso = async (req, res) => {
  try {
    const cursoActualizado = await Curso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("profesor", "nombre apellido nombre_completo")
      .populate("alumnos", "nombre apellido email");

    if (!cursoActualizado) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Mantener inscriptos sincronizado
    cursoActualizado.inscriptos = cursoActualizado.alumnos.length;
    await cursoActualizado.save();

    res.json(cursoActualizado);
  } catch (error) {
    console.error("❌ Error al actualizar curso:", error);
    res.status(400).json({
      message: "Error al actualizar el curso",
      error: error.message,
    });
  }
};

/* =====================================================
   ❌ ELIMINAR CURSO
===================================================== */
export const borrarCurso = async (req, res) => {
  try {
    const eliminado = await Curso.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    res.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar curso:", error);
    res.status(500).json({
      message: "Error al eliminar el curso",
      error: error.message,
    });
  }
};

/* =====================================================
   🧍‍♂️ INSCRIBIR ALUMNO EN UN CURSO
===================================================== */
export const inscribirAlumno = async (req, res) => {
  try {
    const { idCurso, idAlumno } = req.body;

    const curso = await Curso.findById(idCurso)
      .populate("profesor", "nombre apellido nombre_completo")
      .populate("alumnos", "nombre apellido email");

    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Verificar si el alumno ya está inscripto
    const yaInscripto = curso.alumnos.some(
      (alumno) => alumno._id.toString() === idAlumno
    );
    if (yaInscripto) {
      return res
        .status(400)
        .json({ message: "El alumno ya está inscripto en este curso" });
    }

    // Verificar cupos disponibles 
    const cuposDisponibles = curso.cupos - curso.inscriptos;
    if (cuposDisponibles <= 0) {
      return res.status(400).json({ message: "No hay cupos disponibles" });
    }

    // Agregar alumno e incrementar inscriptos
    curso.alumnos.push(idAlumno);
    curso.inscriptos = curso.alumnos.length;

    await curso.save({ validateModifiedOnly: true });

    const cursoActualizado = await Curso.findById(idCurso)
      .populate("profesor", "nombre apellido nombre_completo")
      .populate("alumnos", "nombre apellido email");

    res.json({
      message: "Alumno inscripto correctamente",
      curso: cursoActualizado,
    });
  } catch (error) {
    console.error("❌ Error al inscribir alumno:", error);
    res.status(500).json({
      message: "Error al inscribir alumno",
      error: error.message,
    });
  }
};
