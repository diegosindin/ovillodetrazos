import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

//  Cargar variables de entorno (.env)
dotenv.config();

//  Importar rutas
import cursoRoutes from "./routes/cursoRoutes.js";
import profesorRoutes from "./routes/profesorRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

//  Inicializar app
const app = express();

//  Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Conexión a MongoDB Atlas o local
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://amboxclase5:amboxclase5@cluster0.ivycni8.mongodb.net/backfinal?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado correctamente a MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ Error al conectar con MongoDB:", err.message);
    process.exit(1);
  });

//  Rutas principales del backend
app.use("/api/cursos", cursoRoutes);
app.use("/api/profesores", profesorRoutes);
app.use("/api/usuarios", usuarioRoutes);

//  Ruta base (para verificar funcionamiento)
app.get("/", (req, res) => {
  res.send("✅ Servidor backend funcionando correctamente 🚀");
});

//  Middleware global de errores
app.use((err, req, res, next) => {
  console.error("🔥 Error global del servidor:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3600;
app.listen(PORT, () => {
  console.log(`💻 Servidor corriendo en: http://localhost:${PORT}`);
});
