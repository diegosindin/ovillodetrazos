import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./inicio.css";

const Inicio = () => {
  const [mostrarOpcionesRegistro, setMostrarOpcionesRegistro] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="inicio-container">
      <div className="inicio-card">
        <h1 className="inicio-titulo">
          Bienvenido a <span className="marca">Ovillo de Trazos</span>
        </h1>

        <p className="inicio-texto">
          Conectá con profesores, encontrá cursos y aprendé a tu ritmo.
        </p>

        {/* Botones principales */}
        {!mostrarOpcionesRegistro ? (
          <div className="botones-inicio">
            <button
              className="btn-inicio btn-login"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>

            <button
              className="btn-inicio btn-registro"
              onClick={() => setMostrarOpcionesRegistro(true)}
            >
              Registrarme
            </button>
          </div>
        ) : (
          /* Opciones de registro */
          <div className="botones-registro">
            <h3 className="subtitulo">¿Cómo querés registrarte?</h3>

            <Link to="/registro" className="btn-inicio btn-usuario">
              Como Usuario
            </Link>

            <Link to="/profesores" className="btn-inicio btn-profesor">
              Como Profesor
            </Link>

            <button
              className="btn-volver"
              onClick={() => setMostrarOpcionesRegistro(false)}
            >
              ← Volver
            </button>
          </div>
        )}

        <p className="pie">
          ¿Necesitás ayuda?{" "}
          <Link to="/contacto" className="link-secundario">
            Contáctanos
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Inicio;
