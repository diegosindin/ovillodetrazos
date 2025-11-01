import { useState } from "react";
import { registrarUsuario } from "../services/usuarioService";
import "./registroUsuario.css"; 

const RegistroUsuario = () => {
  const [form, setForm] = useState({
    nombre_completo: "",
    email: "",
    contraseña: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registrarUsuario(form);
      console.log("📦 Respuesta del servidor:", res.data);

      // Desestructuramos la respuesta
      const { mensaje, usuario } = res.data;

      // Mostramos nombre si viene dentro de la respuesta
      if (usuario && usuario.nombre_completo) {
        setMensaje(`Usuario creado exitosamente: ${usuario.nombre_completo}`);
      } else if (res.data.nombre_completo) {
        setMensaje(`Usuario creado exitosamente: ${res.data.nombre_completo}`);
      } else {
        setMensaje(mensaje || "Usuario creado correctamente");
      }

      setTipoMensaje("exito");
      setForm({ nombre_completo: "", email: "", contraseña: "" });
    } catch (error) {
      console.error("❌ Error al registrar:", error);
      setMensaje(error.response?.data?.mensaje || "Error al registrar");
      setTipoMensaje("error");
    }

    // Limpia el mensaje después de 3 segundos
    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 3000);
  };

  return (
    <div className="registro-usuario-page">
      <div className="formulario-usuario">
        <h2>🧶 Registro de Usuario</h2>
        <p className="descripcion">
          Crea tu cuenta para acceder a los cursos de Ovillo de Trazos
        </p>

        {mensaje && (
          <p
            className={
              tipoMensaje === "exito" ? "mensaje-exito" : "mensaje-error"
            }
          >
            {mensaje}
          </p>
        )}

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
            placeholder="Correo electrónico"
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
            required
          />

          <button type="submit">Crear Cuenta</button>
        </form>

        <p className="ya-registrado">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
};

export default RegistroUsuario;
