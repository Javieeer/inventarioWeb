const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.put('/', async (req, res) => {
  const { id, nombre, apellido, documento, email, password } = req.body;

  // Verifica si es admin según tu lógica de autenticación
  const { user } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
  if (user.role !== 'admin') return res.status(403).json({ error: 'No autorizado' });

  try {
    // Actualiza la tabla personalizada
    const { error: updateError } = await supabase
      .from('users')
      .update({ nombre, apellido, documento })
      .eq('id', id);

    if (updateError) throw updateError;

    // Si cambió el correo o la contraseña, actualízalo también en auth
    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = password;

    if (Object.keys(updates).length) {
      const { error: authError } = await supabase.auth.admin.updateUserById(id, updates);
      if (authError) throw authError;
    }

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;