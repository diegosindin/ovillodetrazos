import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

//  Componentes
import FormularioUsuario from "./components/formularioUsuario";
import FormularioProfesor from "./components/formularioProfesor";
import FormularioCurso from "./components/formularioCurso";
import Login from "./pages/login";
import Inscripciones from "./pages/inscripciones";

// Contexto
import { CursoProvider } from "./context/CursoContext";

import "./App.css";

function App() {
  const [usuario, setUsuario] = useState(null);

  //  Cargar usuario desde sessionStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = sessionStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  //  Eliminar sesión al recargar o cerrar la pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("usuario");
      sessionStorage.removeItem("token");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  //  Escucha cambios de sesión
  useEffect(() => {
    const handleStorageChange = () => {
      const usuarioActualizado = sessionStorage.getItem("usuario");
      setUsuario(usuarioActualizado ? JSON.parse(usuarioActualizado) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("token");
    setUsuario(null);
    window.location.href = "/login"; // refresca y redirige
  };

  return (
    <CursoProvider>
      <BrowserRouter>
        <div className="app-container">
          {/* ---------- NAVBAR ---------- */}
          <nav className="navbar">
            <Link to="/" className="logo">
              Ovillo de Trazos
            </Link>
            <ul className="nav-links">
              {usuario ? (
                <>
                  <li>
                    <span>👋 Hola, {usuario.nombre || usuario.email}</span>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/registro">Registrarse</Link>
                  </li>
                  <li>
                    <Link to="/login">Iniciar Sesión</Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/usuarios">Usuarios</Link>
              </li>
              <li>
                <Link to="/profesores">Profesores</Link>
              </li>
              <li>
                <Link to="/cursos">Cursos</Link>
              </li>
            </ul>
          </nav>

          {/* ---------- CONTENIDO PRINCIPAL ---------- */}
          <Routes>
            {/* 🏠 Página principal */}
            <Route
              path="/"
              element={
                <div className="inicio">
                  <div className="inicio-contenido">
                    <h2>Bienvenido a Ovillo de Trazos</h2>
                    <p>Tu plataforma educativa para conectar, aprender y crecer.</p>
                    {!usuario && (
                      <div style={{ marginTop: "1.5rem" }}>
                        <Link to="/registro">
                          <button>Registrarse</button>
                        </Link>
                        <Link to="/login" style={{ marginLeft: "1rem" }}>
                          <button>Iniciar Sesión</button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              }
            />

            {/* 🔐 Rutas del sistema */}
            <Route path="/registro" element={<FormularioUsuario />} />
            <Route path="/inscripciones" element={<Inscripciones />} />
            <Route path="/login" element={<Login />} />
            <Route path="/usuarios" element={<FormularioUsuario />} />
            <Route path="/profesores" element={<FormularioProfesor />} />
            <Route path="/cursos" element={<FormularioCurso />} />
          </Routes>

          {/* ---------- FOOTER ---------- */}
          <footer className="footer">
            <p>© 2025 Ovillo de Trazos — Desarrollado por Diego Sindín</p>
          </footer>
        </div>
      </BrowserRouter>
    </CursoProvider>
  );
}

export default App;
