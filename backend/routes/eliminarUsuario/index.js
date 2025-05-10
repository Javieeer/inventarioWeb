/* const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Usa solo en backend
);

app.post("/eliminarUsuario", async (req, res) => {
  const { id } = req.body;

  try {
    // 1. Eliminar de tu tabla personalizada
    const { error: errorDB } = await supabase.from("users").delete().eq("id", id);
    if (errorDB) throw errorDB;

    // 2. Eliminar de auth.users
    const { error: errorAuth } = await supabase.auth.admin.deleteUser(id);
    if (errorAuth) throw errorAuth;

    return res.status(200).json({ mensaje: "Usuario eliminado con éxito." });
  } catch (error) {
    console.error("Error eliminando usuario:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
 */

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/', async (req, res) => {
  const { id } = req.body;

  try {
    const { error: errorDB } = await supabase.from('users').delete().eq('id', id);
    if (errorDB) throw errorDB;

    const { error: errorAuth } = await supabase.auth.admin.deleteUser(id);
    if (errorAuth) throw errorAuth;

    return res.status(200).json({ mensaje: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error eliminando usuario:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
