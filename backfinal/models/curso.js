import mongoose from "mongoose";

const cursoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  duracion: {
    type: String,
  },
  precio: {
    type: Number,
  },

  //  Cupos totales del curso
  cupos: {
    type: Number,
    required: true,
    default: 10,
  },

  //  Cantidad de alumnos actualmente inscriptos
  inscriptos: {
    type: Number,
    default: 0,
  },

  //  Etiquetas o categorías del curso
  tags: {
    type: [String],
    default: [],
  },

  //  Relación con el profesor asignado
  profesor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profesor", // Debe coincidir con tu modelo Profesor
    required: true,
  },

  //  Relación con alumnos inscriptos
  alumnos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", 
    },
  ],
});

//   calcula  los cupos disponibles
cursoSchema.virtual("cuposDisponibles").get(function () {
  return Math.max(0, this.cupos - this.inscriptos);
});


cursoSchema.set("toJSON", { virtuals: true });
cursoSchema.set("toObject", { virtuals: true });

//  Evita error de redefinición del modelo con Nodemon
const Curso = mongoose.models.Curso || mongoose.model("Curso", cursoSchema);

export default Curso;
