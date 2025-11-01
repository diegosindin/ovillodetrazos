import React, { useState, useEffect } from "react";
import axios from "axios";
import { TAGS } from "../context/tagsList.js";
import "../index.css";

const FormularioCurso = () => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    duracion: "",
    cupos: "",
    profesor: "",
    tags: [],
  });
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const API_CURSOS = "http://localhost:3600/api/cursos";
  const API_PROFESORES = "http://localhost:3600/api/profesores";

  //  Cargar cursos y profesores
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resCursos, resProfesores] = await Promise.all([
          axios.get(API_CURSOS),
          axios.get(API_PROFESORES),
        ]);

        console.log("📘 Cursos obtenidos:", resCursos.data);
        console.log("👨‍🏫 Profesores obtenidos:", resProfesores.data);

        setCursos(Array.isArray(resCursos.data) ? resCursos.data : []);
        setProfesores(Array.isArray(resProfesores.data) ? resProfesores.data : []);
      } catch (error) {
        console.error("❌ Error cargando cursos/profesores:", error);
        alert("Error al cargar datos desde el servidor.");
      }
    };
    cargarDatos();
  }, []);

  //  Manejar cambios del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🔹 Manejar selección de tags (máx. 3)
  const handleTagChange = (tag) => {
    setForm((prev) => {
      const seleccionados = prev.tags.includes(tag);
      if (seleccionados) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      } else if (prev.tags.length < 3) {
        return { ...prev, tags: [...prev.tags, tag] };
      } else {
        alert("Solo puedes seleccionar hasta 3 tags.");
        return prev;
      }
    });
  };

  //  Enviar formulario (crear o editar curso)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.descripcion || !form.duracion || !form.cupos || !form.profesor) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      if (editandoId) {
        //  Editar curso
        const res = await axios.put(`${API_CURSOS}/${editandoId}`, form);
        setCursos((prev) =>
          prev.map((c) => (c._id === editandoId ? res.data : c))
        );
        setMensaje("✅ Curso actualizado correctamente.");
      } else {
        // 🟢 Crear curso
        const res = await axios.post(API_CURSOS, { ...form, inscriptos: 0 });
        setCursos((prev) => [...prev, res.data]);
        setMensaje("✅ Curso creado correctamente.");
      }

      // Reiniciar formulario
      setForm({
        nombre: "",
        descripcion: "",
        duracion: "",
        cupos: "",
        profesor: "",
        tags: [],
      });
      setEditandoId(null);

      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("❌ Error al guardar curso:", error);
      alert("Error al guardar el curso. Ver consola para detalles.");
    }
  };

  //  Editar curso
  const handleEditar = (curso) => {
    setForm({
      nombre: curso.nombre || "",
      descripcion: curso.descripcion || "",
      duracion: curso.duracion || "",
      cupos: curso.cupos || "",
      profesor: curso.profesor?._id || "",
      tags:
        Array.isArray(curso.tags) && curso.tags.length > 0
          ? curso.tags
          : curso.tags?.split(",").map((t) => t.trim()) || [],
    });
    setEditandoId(curso._id);
  };

  //  Eliminar curso
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este curso?")) return;
    try {
      await axios.delete(`${API_CURSOS}/${id}`);
      setCursos((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error al eliminar curso:", error);
    }
  };

  return (
    <div className="formulario-curso">
      <h2>{editandoId ? "Editar Curso" : "Gestión de Cursos"}</h2>
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      {/*  Formulario */}
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre del curso"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción del curso"
          value={form.descripcion}
          onChange={handleChange}
          required
        />
        <input
          name="duracion"
          type="text"
          placeholder="Duración (ej: 10h)"
          value={form.duracion}
          onChange={handleChange}
          required
        />
        <input
          name="cupos"
          type="number"
          placeholder="Cupos totales"
          value={form.cupos}
          onChange={handleChange}
          required
        />

        {/*  Seleccionar profesor */}
        <select
          name="profesor"
          value={form.profesor}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar profesor</option>
          {profesores.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nombre} {p.apellido}
            </option>
          ))}
        </select>

        {/*  Tags */}
        <div className="tags-container">
          <p>
            <strong>Selecciona hasta 3 tags:</strong>
          </p>
          <div className="tags-list">
            {TAGS.map((tag) => (
              <label key={tag} className="tag-label">
                <input
                  type="checkbox"
                  checked={form.tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        <button type="submit">
          {editandoId ? "Actualizar Curso" : "Crear Curso"}
        </button>
      </form>

      <hr />

      {/*  Lista de cursos */}
      <h3>Cursos creados</h3>
      <div className="lista-cursos">
        {cursos.length > 0 ? (
          cursos.map((curso) => {
            const profesor =
              curso.profesor && typeof curso.profesor === "object"
                ? `${curso.profesor.nombre || ""} ${curso.profesor.apellido || ""}`
                : "Sin asignar";

            const inscriptos = Number(curso.inscriptos) || 0;
            const cuposTotales = Number(curso.cupos) || 0;
            const cuposDisponibles = Math.max(cuposTotales - inscriptos, 0);

            return (
              <div className="tarjeta-curso" key={curso._id}>
                <h4>{curso.nombre}</h4>
                <p><strong>Descripción:</strong> {curso.descripcion}</p>
                <p><strong>Duración:</strong> {curso.duracion}</p>
                <p><strong>Cupos totales:</strong> {cuposTotales}</p>
                <p><strong>Inscriptos:</strong> {inscriptos}</p>
                <p><strong>Cupos disponibles:</strong> {cuposDisponibles}</p>
                <p><strong>Profesor:</strong> {profesor}</p>
                <p><strong>Etiquetas:</strong> {curso.tags?.join(", ") || "Sin tags"}</p>

                <div className="botones-curso">
                  <button onClick={() => handleEditar(curso)}>Editar</button>
                  <button onClick={() => handleEliminar(curso._id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No hay cursos registrados.</p>
        )}
      </div>
    </div>
  );
};

export default FormularioCurso;
