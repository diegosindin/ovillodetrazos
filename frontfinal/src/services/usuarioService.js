// services/usuarioService.js
import axios from 'axios';
const API = 'http://localhost:3600/api/usuarios';

export const registrarUsuario = (data) => axios.post(`${API}/registrar`, data);
export const obtenerUsuarios = () => axios.get(API);
export const editarUsuario = (id, data) => axios.put(`${API}/${id}`, data);
export const eliminarUsuario = (id) => axios.delete(`${API}/${id}`);
