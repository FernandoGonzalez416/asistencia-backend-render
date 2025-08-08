require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const docenteRoutes = require("./routes/docenteRoutes");
const usuariosRoutes = require("./routes/usuarios.routes");
const salonesRoutes = require("./routes/salones.routes");
const alumnosRoutes = require("./routes/alumnos.routes");

const app = express();
app.use(cors({ origin: true })); 
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/docente", docenteRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/salones", salonesRoutes);
app.use("/api/alumnos", alumnosRoutes);


app.get("/", (_req, res) => res.send("OK"));

const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
