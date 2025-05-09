import React from 'react';
import { useState } from "react";
import {
  Toolbar,
  CssBaseline,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/dashboard";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Saludo from "../components/saludo";
import MenuLateral from "../components/menuLateral";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const NuevoEmpleado = () => {

  /* Declaramos estados necesarios */
  const { userData } = useAuth();
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    rol: "",
    email: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // o "error"
  const navigate = useNavigate();
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  /* Definimos el rol para mostrar o no la db de empleados */
  const isAdmin = userData?.rol === "admin";

  /* Función para manejar el cambio de los campos de entrada de texto */
  const handleChange = (e) => {
    setNuevoEmpleado({
      ...nuevoEmpleado,
      [e.target.name]: e.target.value,
    });
  };

  /* Función para crear un nuevo empleado */
  const crearEmpleado = async () => {
    const { nombre, apellido, documento, rol, email } = nuevoEmpleado;

    // Validación de campos vacíos
    if (!nombre || !apellido || !documento || !rol || !email) {
      setSnackbarMessage("Todos los campos son obligatorios.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Validar que nombre y apellido no contengan números
    const contieneNumero = /\d/;
    if (contieneNumero.test(nombre) || contieneNumero.test(apellido)) {
      setSnackbarMessage("Nombre y apellido no deben contener números.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Validar que documento solo contenga números
    const soloNumeros = /^\d+$/;
    if (!soloNumeros.test(documento)) {
      setSnackbarMessage("El documento debe contener solo números.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Validar que el correo contenga un '@'
    if (!email.includes("@")) {
      setSnackbarMessage("El correo debe contener el símbolo '@'.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Si pasa todas las validaciones, insertar en Supabase
    const { error } = await supabase.from("users").insert([nuevoEmpleado]);
    if (!error) {
      setSnackbarMessage("Empleado creado con éxito");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate(-1), 1500); // da tiempo a leer el mensaje
    } else {
      setSnackbarMessage("Error al crear el empleado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  /* Función para cancelar la creación del nuevo empleado */
  const cancelar = () => {
    navigate(-1); // Volver atrás sin guardar
  };

  return (
    /* Container principal */
    <Box sx={styles.dashboardContainer}>
      <CssBaseline />

      {/* Saludo */}
      <Saludo />

      {/* Menu lateral */}
      <MenuLateral rol = { isAdmin } />

      {isAdmin && (
        /* Contenido de la pagina */
        <Box component="main" sx={styles.mainContent}>
          <Toolbar />

          <h1>Nuevo empleado</h1>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={nuevoEmpleado.nombre}
              onChange={handleChange}
            />
            <TextField
              label="Apellido"
              name="apellido"
              value={nuevoEmpleado.apellido}
              onChange={handleChange}
            />
            <TextField
              label="Documento"
              name="documento"
              value={nuevoEmpleado.documento}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel id="rol-label">Rol</InputLabel>
              <Select
                labelId="rol-label"
                name="rol"
                value={nuevoEmpleado.rol}
                label="Rol"
                onChange={handleChange}
              >
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="empleado">empleado</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Correo"
              name="email"
              value={nuevoEmpleado.email}
              onChange={handleChange}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" onClick={crearEmpleado}>
                Guardar
              </Button>
              <Button variant="outlined" onClick={cancelar}>
                Cancelar
              </Button>
            </Box>
          </Box>
          
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default NuevoEmpleado;