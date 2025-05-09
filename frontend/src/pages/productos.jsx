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
import Saludo from "../components/saludo";
import MenuLateral from "../components/menuLateral";

const Productos = () => {

  /* Declaramos estados necesarios para la ruta de empleados */
  const { userData } = useAuth();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  /* Definimos el rol para mostrar o no la db de empleados */
  const isAdmin = userData?.rol === "admin";

  /* Guardamos en empleados los empleados de la base de datos */
  const cargarProductos = async () => {
    const { data, error } = await supabase.from("users").select("nombre, apellido, documento, rol, email, id");
    if (!error) setEmpleados(data);
  };

  /* Buscamos los empleados que coincidan con la busqueda y actualizamos empleados*/
  const buscarProductos = () => {
    const filtrados = productos.filter(e =>
      Object.values(e).some(valor => valor.toLowerCase().includes(busqueda.toLowerCase()))
    );
    setProductos(filtrados);
  };

  /* Limpiamos los resultados y volvemos a cargar todos los empleados */
  const limpiarBusqueda = () => {
    setBusqueda("");
    cargarProductos();
  };

  /* Eliminamos empleado siempre y cuando no seas tu mismo */
  const eliminarProducto = async (id) => {
    if (userData.id === id) {
      alert("No puedes eliminar tu propio usuario.");
      return;
    } else {
      respuesta = window.confirm("¿Estás seguro de que deseas eliminar este empleado?");
      if (!respuesta) return;
      if (respuesta) {
        const { error } = await supabase.from("users").delete().eq("id", id);
        if (!error) cargarProductos();
      }
    }
  };

  /* Tan pronto como se carga la pagina se cargan todos los empleados */
  useEffect(() => {
    cargarProductos();
  }, []);

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
            <Toolbar />

            {/* Sección de busqueda */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField label="Buscar Productos" variant="outlined" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                <Button variant="contained" onClick={buscarProductos}>Buscar</Button>
                <Button variant="outlined" onClick={limpiarBusqueda}>Limpiar</Button>
                <Button variant="contained" color="success">Crear Producto</Button>
            </Box>

            {/* Tabla de productos */}
            <h1>Tabla de productos</h1>

        </Box>
    </Box>
  );
};

export default Productos;
