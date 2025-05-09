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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/dashboard";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Saludo from "../components/saludo";
import MenuLateral from "../components/menuLateral";

const NuevoProducto = () => {

  /* Declaramos estados necesarios para la ruta de empleados */
  const { userData } = useAuth();
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

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

      {isAdmin && (
        /* Contenido de la pagina */
        <Box component="main" sx={styles.mainContent}>
          <Toolbar />

            <h1>Creamos el nuevo producto</h1>

        </Box>
      )}
    </Box>
  );
};

export default NuevoProducto;
