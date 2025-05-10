import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  CssBaseline,
  Toolbar
} from "@mui/material";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../context/AuthContext";
import Saludo from "../components/saludo";
import MenuLateral from "../components/menuLateral";
import { styles } from "../styles/dashboard";

const EditarEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const isAdmin = userData?.rol === "admin";

  const [empleado, setEmpleado] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    rol: "",
    email: ""
  });

  useEffect(() => {
    const obtenerEmpleado = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al obtener empleado:", error);
        navigate("/empleados");
      } else {
        setEmpleado(data);
      }
    };

    obtenerEmpleado();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("users")
      .update(empleado)
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar:", error);
    } else {
      navigate("/empleados");
    }
  };

  return (
    <Box sx={styles.dashboardContainer}>
      <CssBaseline />
      <Saludo />
      <MenuLateral rol={isAdmin} />

      {isAdmin ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <Container maxWidth="sm">
            <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Editar Empleado
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre"
                      value={empleado.nombre}
                      onChange={(e) => setEmpleado({ ...empleado, nombre: e.target.value })}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Apellido"
                      value={empleado.apellido}
                      onChange={(e) => setEmpleado({ ...empleado, apellido: e.target.value })}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Correo"
                      value={empleado.email}
                      onChange={(e) => setEmpleado({ ...empleado, email: e.target.value })}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Documento"
                      value={empleado.documento}
                      onChange={(e) => setEmpleado({ ...empleado, documento: e.target.value })}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Rol"
                      value={empleado.rol}
                      onChange={(e) => setEmpleado({ ...empleado, rol: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                  <Button type="submit" variant="contained" color="primary">
                    Actualizar
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => navigate("/empleados")}>
                    Cancelar
                  </Button>
                </Box>
              </form>
            </Paper>
          </Container>
        </Box>
      ) : (
        <Box component="main" sx={styles.mainContent}>
          <Toolbar />
          <Typography variant="h4" color="error">Acceso denegado</Typography>
          <Typography>No tienes permiso para acceder a esta sección.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default EditarEmpleado;
