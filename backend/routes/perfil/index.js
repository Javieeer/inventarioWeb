const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.put('/', async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) return res.status(401).json({ error: 'Token inválido' });

    const userId = userData.user.id;
    console.log('Actualizando perfil del usuario con ID:', userId); // Depuración

    // Actualizar datos en la tabla personalizada 'users'
    const { data: updatedUserData, error: updateError } = await supabase
      .from('users')
      .update({ nombre, apellido })
      .eq('id', userId)
      .select();

    if (updateError) {
      console.error('Error al actualizar la tabla users:', updateError.message); // Depuración
      throw updateError;
    }

    console.log('Datos actualizados en users:', updatedUserData); // Depuración

    // Actualizar correo o contraseña en la tabla de autenticación (auth)
    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = password;

    if (Object.keys(updates).length > 0) {
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, updates);
      console.log('Actualizando email/contraseña en auth con:', updates);
      console.log('Usando userId:', userId);

      if (authError) {
        console.error('Auth update error:', authError);
        return res.status(500).json({ error: 'Error actualizando autenticación', details: authError });
      }
    }

    // Verifica que la actualización se haya realizado correctamente en ambas tablas
    const { data: finalUpdatedUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error al obtener el usuario después de la actualización:', fetchError.message); // Depuración
      throw fetchError;
    }

    res.status(200).json({ message: 'Perfil actualizado correctamente', updatedUser: finalUpdatedUser });
  } catch (err) {
    console.error('Error en PUT /perfil:', err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
