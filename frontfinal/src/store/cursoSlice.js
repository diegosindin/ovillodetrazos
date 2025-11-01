import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:3600/api/cursos';

export const fetchCursos = createAsyncThunk('cursos/fetch', async () => {
  const res = await axios.get(API);
  return res.data;
});

const cursoSlice = createSlice({
  name: 'cursos',
  initialState: {
    lista: [],
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCursos.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchCursos.fulfilled, (state, action) => {
      state.lista = action.payload;
      state.status = 'success';
    });
    builder.addCase(fetchCursos.rejected, (state) => {
      state.status = 'error';
    });
  }
});

export default cursoSlice.reducer;
