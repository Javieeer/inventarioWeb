// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀');
});

// Rutas
const editarUsuario = require('./routes/editarUsuario/index');
const eliminarUsuario = require('./routes/eliminarUsuario/index');

app.use('/editarUsuario', editarUsuario);
app.use('/eliminarUsuario', eliminarUsuario);

/* // Importar tus rutas
app.use("/eliminarUsuario", require("./eliminarUsuario/index"));
app.use("/editarUsuario", require("./editarUsuario/index"));
// ... otras rutas */

// Configuración de puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});