import Usuario from "../models/usuarioModel.js";
import Curso from "../models/curso.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "clave_super_segura";

/* ===============================
   REGISTRAR UN NUEVO USUARIO
================================= */
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre_completo, email, contraseña } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    const nuevoUsuario = new Usuario({
      nombre_completo,
      email,
      contraseña,
    });

    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario._id,
        nombre_completo: nuevoUsuario.nombre_completo,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ mensaje: "Error al registrar usuario", error });
  }
};

/* ===============================
   OBTENER TODOS LOS USUARIOS
================================= */
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().populate("cursos_inscritos");
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
};

/* ===============================
   INSCRIBIR USUARIO EN UN CURSO
================================= */
export const inscribirCurso = async (req, res) => {
  const { id, cursoId } = req.params;

  try {
    const usuario = await Usuario.findById(id);
    const curso = await Curso.findById(cursoId);

    if (!usuario || !curso) {
      return res.status(404).json({ mensaje: "Usuario o curso no encontrado" });
    }

    // Verificar cupos disponibles
    if (curso.inscriptos >= curso.cupos) {
      return res.status(400).json({ mensaje: "No hay cupos disponibles" });
    }

    if (usuario.cursos_inscritos.includes(cursoId)) {
      return res
        .status(400)
        .json({ mensaje: "Ya estás inscrito en este curso" });
    }

    //  Registrar inscripción
    usuario.cursos_inscritos.push(cursoId);
    await usuario.save();

    //  Incrementar cantidad de inscriptos
    curso.inscriptos += 1;
    await curso.save();

    res.json({
      mensaje: "Inscripción exitosa",
      usuario,
      cursoActualizado: curso,
    });
  } catch (error) {
    console.error("❌ Error al inscribirse en el curso:", error);
    res.status(500).json({ mensaje: "Error al inscribirse", error });
  }
};

/* ===============================
   INICIAR SESIÓN (LOGIN)
================================= */
export const loginUsuario = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const contraseñaValida = await usuario.compararContraseña(contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        nombre_completo: usuario.nombre_completo,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: usuario._id,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error en el login:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
};
