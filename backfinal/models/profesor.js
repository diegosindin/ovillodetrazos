import mongoose from "mongoose";

const profesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  biografia: { type: String },

  redes_sociales: {
    whatsapp: { type: String },
    email: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
  },
});

// Campo virtual: nombre_completo
profesorSchema.virtual("nombre_completo").get(function () {
  return `${this.nombre} ${this.apellido}`;
});

// Incluye los virtuals en los resultados JSON
profesorSchema.set("toJSON", { virtuals: true });
profesorSchema.set("toObject", { virtuals: true });

//  Evita error de redefinición del modelo
const Profesor =
  mongoose.models.Profesor || mongoose.model("Profesor", profesorSchema);

export default Profesor;
