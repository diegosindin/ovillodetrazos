import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

const FormularioProfesor = () => {
  const [profesores, setProfesores] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    biografia: '',
    linkedin: '',
    whatsapp: '',
    facebook: '',
    email: '',
    twitter: ''
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  const API_URL = 'http://localhost:3600/api/profesores';

  useEffect(() => {
    cargarProfesores();
  }, []);

  const cargarProfesores = async () => {
    try {
      const res = await axios.get(API_URL);
      setProfesores(res.data);
    } catch (error) {
      console.error('Error al cargar profesores:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarURL = (url) => {
    if (!url || url.trim() === '') return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = {
      nombre: form.nombre,
      apellido: form.apellido,
      biografia: form.biografia,
      redes_sociales: {
        linkedin: limpiarURL(form.linkedin),
        whatsapp: form.whatsapp,
        facebook: limpiarURL(form.facebook),
        email: form.email,
        twitter: limpiarURL(form.twitter)
      }
    };

    try {
      if (editandoId) {
        await axios.put(`${API_URL}/${editandoId}`, datos);
        setMensaje('Profesor actualizado correctamente');
      } else {
        await axios.post(API_URL, datos);
        setMensaje('Profesor creado correctamente');
      }

      setTipoMensaje('exito');
      setForm({
        nombre: '',
        apellido: '',
        biografia: '',
        linkedin: '',
        whatsapp: '',
        facebook: '',
        email: '',
        twitter: ''
      });
      setEditandoId(null);
      cargarProfesores();
    } catch (error) {
      console.error('Error al guardar el profesor:', error);
      setMensaje('Error al guardar el profesor');
      setTipoMensaje('error');
    }

    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 3000);
  };

  const handleEditar = (prof) => {
    setForm({
      nombre: prof.nombre,
      apellido: prof.apellido,
      biografia: prof.biografia,
      linkedin: prof.redes_sociales?.linkedin || '',
      whatsapp: prof.redes_sociales?.whatsapp || '',
      facebook: prof.redes_sociales?.facebook || '',
      email: prof.redes_sociales?.email || '',
      twitter: prof.redes_sociales?.twitter || ''
    });
    setEditandoId(prof._id);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      cargarProfesores();
    } catch (error) {
      console.error('Error al eliminar profesor:', error);
    }
  };

  const renderRedSocial = (label, url, tipo) => {
    if (!url || url.trim() === '') return null;

    let enlace = url;

    if (tipo === 'whatsapp') {
      const numero = url.replace(/\D/g, '');
      if (!numero) return null;
      enlace = `https://wa.me/${numero}`;
    } else if (tipo === 'email') {
      enlace = `mailto:${url}`;
    } else if (!enlace.startsWith('http') && !enlace.startsWith('mailto')) {
      enlace = `https://${enlace}`;
    }

    return (
      <a href={enlace} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  };

  return (
    <div className="registro-profesor-page">
      <div className="formulario-profesor">
        <h2>Registro de Profesores</h2>

        {mensaje && (
          <p className={tipoMensaje === 'exito' ? 'mensaje-exito' : 'mensaje-error'}>
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
          <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
          <textarea name="biografia" placeholder="Biografía" value={form.biografia} onChange={handleChange} rows={4} />
          <input name="whatsapp" placeholder="Whatsapp sin 0 ni 15 (ej: 5493511234567)" value={form.whatsapp} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="facebook" placeholder="Facebook" value={form.facebook} onChange={handleChange} />
          <input name="linkedin" placeholder="LinkedIn" value={form.linkedin} onChange={handleChange} />
          <input name="twitter" placeholder="Twitter" value={form.twitter} onChange={handleChange} />
          <button type="submit">{editandoId ? 'Actualizar' : 'Crear Profesor'}</button>
        </form>
      </div>

      <div className="tarjetas-profesores">
        {profesores.length === 0 ? (
          <p>No hay profesores cargados aún.</p>
        ) : (
          profesores.map((prof) => (
            <div key={prof._id} className="tarjeta-profesor">
              <h3>{prof.nombre} {prof.apellido}</h3>
              <p className="biografia-profesor">{prof.biografia}</p>
              <div className="redes-sociales">
                {renderRedSocial('Whatsapp', prof.redes_sociales?.whatsapp, 'whatsapp')}
                {renderRedSocial('Email', prof.redes_sociales?.email, 'email')}
                {renderRedSocial('Facebook', prof.redes_sociales?.facebook)}
                {renderRedSocial('LinkedIn', prof.redes_sociales?.linkedin)}
                {renderRedSocial('Twitter', prof.redes_sociales?.twitter)}
              </div>
              <div className="acciones-profesor">
                <button onClick={() => handleEditar(prof)}>Editar</button>
                <button onClick={() => handleEliminar(prof._id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FormularioProfesor;
