import { useEffect, useState } from "react";
import {
  Toolbar,
  CssBaseline,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/dashboard";
import { useNavigate } from "react-router-dom";
import { usarMensaje } from "../../context/mensaje";
import { supabase } from "../../../supabaseClient";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";

const ConfigPerfil = () => {
  const { userData } = useAuth();
  const { mostrarMensaje } = usarMensaje();
  const isAdmin = userData?.rol === "admin";
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  useEffect(() => {
    if (userData) {
      setPerfil({
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        correo: userData.email || "",
        rol: userData.rol || "",
        contraseña: "",
        confirmarContraseña: "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = (await supabase.auth.getSession()).data.session.access_token;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/mi-perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: perfil.nombre,
          apellido: perfil.apellido,
          email: isAdmin ? perfil.correo : undefined,
          password: perfil.contraseña || undefined,
        }),
      });

      const data = await response.json();
      console.log('Respuesta del backend:', data); // Depuración

      if (!response.ok) throw new Error(data.error || "Error al actualizar");

      mostrarMensaje("success", "Perfil actualizado correctamente");
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      mostrarMensaje("error", err.message);
    }
  };


  return (
    <Box sx={styles.dashboardContainer}>
      <CssBaseline />
      <Saludo />
      <MenuLateral rol={isAdmin} />

      <Box component="main" sx={styles.mainContent}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ marginBottom: 5 }}>
            Configuración de Perfil
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            autoComplete="off"
          >
            <Grid container spacing={3} sx={{ width: "100%", justifyContent: "center" }}>
              <Grid xs={12}>
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={perfil.nombre}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Apellido"
                  name="apellido"
                  value={perfil.apellido}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label={isAdmin ? "Nuevo correo" : "Correo actual"}
                  name="correo"
                  value={perfil.correo}
                  onChange={handleChange}
                  fullWidth
                  disabled={!isAdmin}
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Rol"
                  name="rol"
                  value={perfil.rol}
                  fullWidth
                  disabled
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Nueva contraseña"
                  name="contraseña"
                  type="password"
                  value={perfil.contraseña}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Confirmar contraseña"
                  name="confirmarContraseña"
                  type="password"
                  value={perfil.confirmarContraseña}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Button type="submit" variant="contained" color="primary">
                Guardar cambios
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => navigate("/dashboard")}>
                Cancelar
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default ConfigPerfil;
