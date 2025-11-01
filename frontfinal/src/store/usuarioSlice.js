// src/store/usuarioSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:3600/api/usuarios';

export const fetchUsuarios = createAsyncThunk('usuarios/fetch', async () => {
  const res = await axios.get(API);
  return res.data;
});

const usuarioSlice = createSlice({
  name: 'usuarios',
  initialState: { lista: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsuarios.fulfilled, (state, action) => {
      state.lista = action.payload;
      state.status = 'success';
    });
  }
});

export default usuarioSlice.reducer;
