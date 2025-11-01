import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:3600/api/profesores';

export const fetchProfesores = createAsyncThunk('profesores/fetch', async () => {
  const res = await axios.get(API);
  return res.data;
});

const profesorSlice = createSlice({
  name: 'profesores',
  initialState: {
    lista: [],
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfesores.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchProfesores.fulfilled, (state, action) => {
      state.lista = action.payload;
      state.status = 'success';
    });
    builder.addCase(fetchProfesores.rejected, (state) => {
      state.status = 'error';
    });
  }
});

export default profesorSlice.reducer;
