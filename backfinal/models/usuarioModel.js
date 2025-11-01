import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nombre_completo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  cursos_inscritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }],
});

// Hashear contraseña automáticamente si fue modificada
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar contraseñas 
usuarioSchema.methods.compararContraseña = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.contraseña);
};

// Evita el error “OverwriteModelError” si el servidor recarga
const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);

export default Usuario;
