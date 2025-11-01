import React, { useState, useEffect } from "react";
import axios from "axios";
import { TAGS } from "../context/tagsList.js";
import "../index.css";

const FormularioUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre_completo: "",
    email: "",
    contraseña: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [usuarioActivo, setUsuarioActivo] = useState(localStorage.getItem("usuarioId") || null);

  const [cursos, setCursos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tagsSeleccionados, setTagsSeleccionados] = useState([]);

  const API_USUARIOS = "http://localhost:3600/api/usuarios";
  const API_CURSOS = "http://localhost:3600/api/cursos";

  //  Cargar usuarios
  const cargarUsuarios = async () => {
    try {
      const res = await axios.get(API_USUARIOS);
      setUsuarios(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error);
    }
  };

  //  Cargar cursos
  const cargarCursos = async () => {
    try {
      const res = await axios.get(API_CURSOS);
      setCursos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("❌ Error al cargar cursos:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarCursos();
  }, []);

  //  Manejadores de formulario de usuario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      if (editandoId) {
        await axios.put(`${API_USUARIOS}/${editandoId}`, form);
      } else {
        await axios.post(`${API_USUARIOS}/registrar`, form);
      }

      setForm({ nombre_completo: "", email: "", contraseña: "" });
      setEditandoId(null);
      cargarUsuarios();

      setMensaje(editandoId ? "✅ Usuario actualizado correctamente" : "✅ Usuario registrado correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("❌ Error al enviar el formulario:", error);
      alert("Error al registrar o actualizar usuario");
    }
  };

  const handleEditar = (usuario) => {
    setForm({
      nombre_completo: usuario.nombre_completo,
      email: usuario.email,
      contraseña: "",
    });
    setEditandoId(usuario._id);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API_USUARIOS}/${id}`);
      cargarUsuarios();
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
    }
  };

  //  Seleccionar usuario activo
  const handleSeleccionarUsuario = (id) => {
    setUsuarioActivo(id);
    localStorage.setItem("usuarioId", id);
    alert("👤 Usuario seleccionado para inscripción");
  };

  //  Filtrar cursos
  const cursosFiltrados = cursos.filter((curso) => {
    const coincideBusqueda =
      curso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      curso.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTag =
      tagsSeleccionados.length === 0 ||
      tagsSeleccionados.some((tag) => curso.tags?.includes(tag));

    return coincideBusqueda && coincideTag;
  });

  //  Manejo de tags (máx. 3)
  const handleTagChange = (tag) => {
    setTagsSeleccionados((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length < 3) return [...prev, tag];
      alert("Solo puedes seleccionar hasta 3 tags");
      return prev;
    });
  };

  //  Inscribirse a un curso
  const handleInscribirse = async (cursoId) => {
    if (!usuarioActivo) {
      alert("⚠️ Primero selecciona un usuario para inscribirte");
      return;
    }

    try {
      const res = await axios.post(`${API_CURSOS}/inscribir`, {
        idCurso: cursoId,
        idAlumno: usuarioActivo,
      });

      alert(res.data.message || "✅ Inscripción exitosa");
      cargarCursos();
      cargarUsuarios();
    } catch (error) {
      console.error("❌ Error al inscribirse:", error);
      alert(error.response?.data?.message || "Error al inscribirse en el curso");
    }
  };

  //  Renderizado
  return (
    <div className="formulario-usuario">
      <h2>Gestión de Usuarios</h2>
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      {/* Formulario de usuario */}
      <form onSubmit={handleSubmit}>
        <input
          name="nombre_completo"
          placeholder="Nombre completo"
          value={form.nombre_completo}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="contraseña"
          type="password"
          placeholder="Contraseña"
          value={form.contraseña}
          onChange={handleChange}
          required={!editandoId}
        />
        <button type="submit">{editandoId ? "Actualizar Usuario" : "Registrar Usuario"}</button>
      </form>

      {/* Lista de usuarios */}
      <ul className="lista-usuarios">
        {usuarios.map((u) => (
          <li
            key={u._id}
            onClick={() => handleSeleccionarUsuario(u._id)}
            style={{
              cursor: "pointer",
              background: usuarioActivo === u._id ? "#e3f2fd" : "transparent",
            }}
          >
            <span>{u.nombre_completo} — {u.email}</span>
            <div>
              <button onClick={(e) => { e.stopPropagation(); handleEditar(u); }}>Editar</button>
              <button onClick={(e) => { e.stopPropagation(); handleEliminar(u._id); }}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>

      <hr />

      {/* Filtros */}
      <h2>Buscar e Inscribirse en Cursos</h2>
      <input
        type="text"
        placeholder="Buscar curso por nombre o descripción..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="tags-container">
        <p><strong>Filtrar por Tags (máx. 3):</strong></p>
        <div className="tags-list">
          {TAGS.map((tag) => (
            <label key={tag} className="tag-label">
              <input
                type="checkbox"
                checked={tagsSeleccionados.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      {/* Cursos */}
      <div className="tarjetas-cursos">
        {cursosFiltrados.length > 0 ? (
          cursosFiltrados.map((curso) => {
            const inscriptos = curso.inscriptos || 0;
            const disponibles = (curso.cupos ?? 0) - inscriptos;

            return (
              <div className="tarjeta-curso" key={curso._id}>
                <h4>{curso.nombre}</h4>
                <p><strong>Descripción:</strong> {curso.descripcion}</p>
                <p><strong>Duración:</strong> {curso.duracion}</p>
                <p><strong>Profesor:</strong> {curso.profesor?.nombre || "Sin asignar"}</p>
                <p><strong>Tags:</strong> {curso.tags?.join(", ") || "Sin tags"}</p>
                <p><strong>Cupos disponibles:</strong> {disponibles}</p>
                <button onClick={() => handleInscribirse(curso._id)} disabled={disponibles <= 0}>
                  {disponibles <= 0 ? "Curso completo" : "Inscribirse"}
                </button>
              </div>
            );
          })
        ) : (
          <p>No se encontraron cursos.</p>
        )}
      </div>
    </div>
  );
};

export default FormularioUsuario;
