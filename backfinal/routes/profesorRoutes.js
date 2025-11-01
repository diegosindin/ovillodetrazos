import express from "express";
import {
  crearProfesor,
  obtenerProfesores,
  actualizarProfesor,
  eliminarProfesor,
} from "../controllers/profesorController.js";

const router = express.Router();

/**
 * @route GET /api/profesores
 * @desc Obtener todos los profesores
 * @access Público
 */
router.get("/", obtenerProfesores);

/**
 * @route POST /api/profesores
 * @desc Crear un nuevo profesor
 * @access Público (o protegido según necesidad)
 */
router.post("/", crearProfesor);

/**
 * @route PUT /api/profesores/:id
 * @desc Actualizar un profesor existente por ID
 * @access Público (o protegido según necesidad)
 */
router.put("/:id", actualizarProfesor);

/**
 * @route DELETE /api/profesores/:id
 * @desc Eliminar un profesor por ID
 * @access Público (o protegido según necesidad)
 */
router.delete("/:id", eliminarProfesor);

// Exportar el router
export default router;
