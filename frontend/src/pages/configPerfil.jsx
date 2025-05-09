import { useEffect, useState } from "react";
import {
  Toolbar,
  CssBaseline,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/dashboard";
import { supabase } from "../../supabaseClient";
import Saludo from "../components/saludo";
import MenuLateral from "../components/menuLateral";

const ConfigPerfil = () => {

  /* Declaramos estados necesarios para la ruta de empleados */
  const { userData } = useAuth();

  /* Definimos el rol para mostrar o no la db de empleados */
  const isAdmin = userData?.rol === "admin";

  return (
    /* Container principal */
    <Box sx={styles.dashboardContainer}>
        <CssBaseline />

        {/* Saludo */}
        <Saludo />

        {/* Menu lateral */}
        <MenuLateral rol = { isAdmin } />

        {/* Contenido de la pagina */}
        <Box component="main" sx={styles.mainContent}>

            {/* Tabla de productos */}
            <h1>Configuración de perfil</h1>

        </Box>
    </Box>
  );
};

export default ConfigPerfil;
