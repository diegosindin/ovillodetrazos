import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCursos } from "../store/cursoSlice";

const Inscripciones = () => {
  const dispatch = useDispatch();
  const { cursos } = useSelector((state) => state.cursos);

  useEffect(() => {
    dispatch(fetchCursos());
  }, [dispatch]);

  return (
    <div className="inscripciones-container">
      <h2>📋 Inscripciones por curso</h2>
      <table className="tabla-inscripciones">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Profesor</th>
            <th>Alumnos Inscriptos</th>
            <th>Cupos Disponibles</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso._id}>
              <td>{curso.nombre}</td>
              <td>{curso.profesor?.nombre || "Sin asignar"}</td>
              <td>
                {curso.alumnos?.length > 0
                  ? curso.alumnos.map((a) => a.nombre).join(", ")
                  : "Sin alumnos"}
              </td>
              <td>{curso.cupos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inscripciones;
