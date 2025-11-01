import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

const CursoContext = createContext();

const cursoReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURSOS":
      return action.payload;

    case "AGREGAR_CURSO":
      return [...state, action.payload];

    case "EDITAR_CURSO":
      return state.map((c) => (c._id === action.payload._id ? action.payload : c));

    case "BORRAR_CURSO":
      return state.filter((c) => c._id !== action.payload);

    case "INSCRIBIR_ALUMNO":
      return state.map((c) => (c._id === action.payload._id ? action.payload : c));

    default:
      return state;
  }
};

export const CursoProvider = ({ children }) => {
  const [cursos, dispatch] = useReducer(cursoReducer, []);

  // Cargar cursos al iniciar
  useEffect(() => {
    const obtenerCursos = async () => {
      try {
        const res = await axios.get("http://localhost:3600/api/cursos");
        dispatch({ type: "SET_CURSOS", payload: res.data });
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      }
    };
    obtenerCursos();
  }, []);

  //  Función para inscribir alumno y actualizar cupos
  const inscribirAlumno = async (idCurso, idAlumno) => {
    try {
      const res = await axios.post("http://localhost:3600/api/cursos/inscribir", {
        idCurso,
        idAlumno,
      });

      dispatch({ type: "INSCRIBIR_ALUMNO", payload: res.data.curso });
      alert(`✅ ${res.data.message}\nCupos restantes: ${res.data.curso.cupos}`);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "❌ Error al inscribirse en el curso."
      );
    }
  };

  return (
    <CursoContext.Provider value={{ cursos, dispatch, inscribirAlumno }}>
      {children}
    </CursoContext.Provider>
  );
};

export default CursoContext;
