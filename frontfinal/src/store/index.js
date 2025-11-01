import { configureStore } from '@reduxjs/toolkit';
import usuarioReducer from './usuarioSlice';
import profesorReducer from './profesorSlice';
import cursoReducer from './cursoSlice';

export const store = configureStore({
  reducer: {
    usuarios: usuarioReducer,
    profesores: profesorReducer,
    cursos: cursoReducer
  }
});
