import express from "express";
import {
  registrarUsuario,
  obtenerUsuarios,
  inscribirCurso,
  loginUsuario,
} from "../controllers/usuarioController.js";
import Usuario from "../models/usuarioModel.js";

const router = express.Router();

/* ===========================
   REGISTRO DE USUARIO
=========================== */
router.post("/registrar", registrarUsuario);

/* ===========================
   LOGIN DE USUARIO
=========================== */
router.post("/login", loginUsuario);

/* ===========================
   OBTENER TODOS LOS USUARIOS
=========================== */
router.get("/", obtenerUsuarios);

/* ===========================
   INSCRIBIR USUARIO EN CURSO
=========================== */
router.post("/:id/inscribir/:cursoId", inscribirCurso);

/* ===========================
   EDITAR USUARIO
=========================== */
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!actualizado)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json({
      mensaje: "Usuario actualizado correctamente",
      usuario: actualizado,
    });
  } catch (error) {
    console.error("❌ Error al editar usuario:", error);
    res.status(500).json({ mensaje: "Error al editar usuario", error });
  }
});

/* ===========================
   ELIMINAR USUARIO
=========================== */
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!eliminado)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario", error });
  }
});

export default router;
