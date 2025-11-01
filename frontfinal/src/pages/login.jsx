import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3600/api/usuarios/login", {
        email,
        contraseña,
      });

      const usuario = res.data.usuario || {};

      //  Guarda en sessionStorage (sesión activa)
      sessionStorage.setItem("usuario", JSON.stringify(usuario));
      if (res.data.token) {
        sessionStorage.setItem("token", res.data.token);
      }

      //  Guarda también en localStorage (para inscripciones y persistencia)
      if (usuario.id || usuario._id) {
        localStorage.setItem("usuarioId", usuario.id || usuario._id);
      }
      if (usuario.nombre_completo) {
        localStorage.setItem("usuarioNombre", usuario.nombre_completo);
      }

      setMensaje(
        `Inicio de sesión exitoso. ¡Bienvenido ${usuario.nombre_completo || ""}!`
      );
      setTipoMensaje("exito");

      //  Redirigir al home después de 1.2s
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      setMensaje(error.response?.data?.mensaje || "Error al iniciar sesión");
      setTipoMensaje("error");
    }

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 3000);
  };

  return (
    <div className="login-page">
      <div className="formulario-login">
        <h2>🔑 Iniciar Sesión</h2>
        <p className="descripcion">
          Ingresa con tu correo y contraseña para acceder a tu cuenta
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
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />

          <button type="submit">Iniciar Sesión</button>
        </form>

        <p className="ya-registrado">
          ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
