import express from "express";
import Curso from "../models/curso.js";
import Usuario from "../models/usuarioModel.js";

const router = express.Router();


// ==========================
//  GET - Obtener todos los cursos
// ==========================
router.get("/", async (req, res) => {
  try {
    const cursos = await Curso.find()
      .populate("profesor", "nombre apellido nombre_completo")
      .populate("alumnos", "nombre apellido email")
      .lean({ virtuals: true }); // Incluye virtuals como cuposDisponibles
    res.json(cursos);
  } catch (error) {
    console.error("❌ Error al obtener cursos:", error);
    res.status(500).json({ message: "Error al obtener cursos" });
  }
});


// ==========================
//  POST - Crear un nuevo curso
// ==========================
router.post("/", async (req, res) => {
  try {
    const nuevoCurso = new Curso(req.body);
    await nuevoCurso.save();

    const cursoCreado = await Curso.findById(nuevoCurso._id)
      .populate("profesor", "nombre apellido nombre_completo")
      .lean({ virtuals: true });

    res.status(201).json(cursoCreado);
  } catch (error) {
    console.error("❌ Error al crear curso:", error);
    res.status(500).json({ message: "Error al crear curso" });
  }
});


// ==========================
//  PUT - Editar un curso existente
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const cursoActualizado = await Curso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("profesor", "nombre apellido nombre_completo")
      .lean({ virtuals: true });

    if (!cursoActualizado)
      return res.status(404).json({ message: "Curso no encontrado" });

    res.json(cursoActualizado);
  } catch (error) {
    console.error("❌ Error al actualizar curso:", error);
    res.status(500).json({ message: "Error al actualizar curso" });
  }
});


// ==========================
//  DELETE - Eliminar un curso
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });
    res.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar curso:", error);
    res.status(500).json({ message: "Error al eliminar curso" });
  }
});


// ==========================
// POST - Inscribir alumno en curso
// ==========================
router.post("/inscribir", async (req, res) => {
  const { idCurso, idAlumno } = req.body;

  try {
    const curso = await Curso.findById(idCurso);
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });

    // Verificar si el alumno ya está inscripto
    if (curso.alumnos.includes(idAlumno)) {
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
    curso.inscriptos += 1;
    await curso.save();

    // Agregar curso al alumno
    await Usuario.findByIdAndUpdate(
      idAlumno,
      { $push: { cursosInscriptos: curso._id } },
      { new: true }
    );

    // Obtener curso actualizado
    const cursoActualizado = await Curso.findById(curso._id)
      .populate("profesor", "nombre apellido nombre_completo")
      .populate("alumnos", "nombre apellido email")
      .lean({ virtuals: true });

    res.json({
      message: "✅ Inscripción exitosa",
      curso: cursoActualizado,
    });
  } catch (error) {
    console.error("❌ Error en inscripción:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


// ==========================
//  Exportar router
// ==========================
export default router;
