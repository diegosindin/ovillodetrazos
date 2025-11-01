import Profesor from "../models/profesor.js";

/**
 *  Crear un nuevo profesor
 */
export const crearProfesor = async (req, res) => {
  try {
    const { nombre, apellido, biografia, redes_sociales } = req.body;

    if (!nombre || !apellido) {
      return res
        .status(400)
        .json({ mensaje: "El nombre y el apellido son obligatorios." });
    }

    const nuevoProfesor = new Profesor({
      nombre,
      apellido,
      biografia,
      redes_sociales,
    });

    await nuevoProfesor.save();
    res.status(201).json(nuevoProfesor);
  } catch (error) {
    console.error("❌ Error al crear profesor:", error);
    res.status(500).json({ mensaje: "Error al crear profesor", error });
  }
};

/**
 *  Obtener todos los profesores
 */
export const obtenerProfesores = async (req, res) => {
  try {
    const profesores = await Profesor.find().lean();

    // Agregamos nombre completo para mostrar fácilmente
    const profesoresConNombreCompleto = profesores.map((p) => ({
      ...p,
      nombre_completo: `${p.nombre} ${p.apellido}`,
    }));

    res.json(profesoresConNombreCompleto);
  } catch (error) {
    console.error("❌ Error al obtener profesores:", error);
    res.status(500).json({ mensaje: "Error al obtener profesores", error });
  }
};

/**
 *  Actualizar profesor
 */
export const actualizarProfesor = async (req, res) => {
  try {
    const { id } = req.params;

    const profesorActualizado = await Profesor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!profesorActualizado) {
      return res.status(404).json({ mensaje: "Profesor no encontrado" });
    }

    res.json(profesorActualizado);
  } catch (error) {
    console.error("❌ Error al actualizar profesor:", error);
    res.status(500).json({ mensaje: "Error al actualizar profesor", error });
  }
};

/**
 *  Eliminar profesor
 */
export const eliminarProfesor = async (req, res) => {
  try {
    const { id } = req.params;

    const profesorEliminado = await Profesor.findByIdAndDelete(id);
    if (!profesorEliminado) {
      return res.status(404).json({ mensaje: "Profesor no encontrado" });
    }

    res.json({ mensaje: "Profesor eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar profesor:", error);
    res.status(500).json({ mensaje: "Error al eliminar profesor", error });
  }
};
