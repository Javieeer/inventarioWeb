import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Box,
  Divider,
  ListItemIcon,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/dashboard";
import { supabase } from "../../supabaseClient";

const Empleados = () => {
  const { userData, logout } = useAuth();
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "", apellido: "", documento: "", rol: "", correo: "" });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const userName = userData?.nombre || "Usuario";
  const userLastName = userData?.apellido || "";

  const cargarEmpleados = async () => {
    
    const { data, error } = await supabase.from("users").select("nombre, apellido, documento, rol, email, id");
    console.log("Usuario:", data);
    if (!error) setEmpleados(data);
  };

  const buscarEmpleados = () => {
    const filtrados = empleados.filter(e =>
      Object.values(e).some(valor => valor.toLowerCase().includes(busqueda.toLowerCase()))
    );
    setEmpleados(filtrados);
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    cargarEmpleados();
  };

  const abrirDialogo = () => setOpenDialog(true);
  const cerrarDialogo = () => {
    setNuevoEmpleado({ nombre: "", apellido: "", documento: "", rol: "", email: "" });
    setOpenDialog(false);
  };

  const crearEmpleado = async () => {
    const { error } = await supabase.from("users").insert([nuevoEmpleado]);
    if (!error) cargarEmpleados();
    cerrarDialogo();
  };

  const eliminarEmpleado = async (id) => {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (!error) cargarEmpleados();
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  return (
    <Box sx={styles.dashboardContainer}>
      <CssBaseline />
      <AppBar position="fixed" sx={styles.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {getGreeting()}, {userName} {userLastName}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: styles.drawerPaper,
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Base de datos empleados" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><InventoryIcon /></ListItemIcon>
              <ListItemText primary="Base de datos productos" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Configuración de perfil" />
            </ListItem>
            <Divider />
            <ListItem button onClick={logout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={styles.mainContent}>
        <Toolbar />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="Buscar empleados" variant="outlined" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <Button variant="contained" onClick={buscarEmpleados}>Buscar</Button>
          <Button variant="outlined" onClick={limpiarBusqueda}>Limpiar</Button>
          <Button variant="contained" color="success" onClick={abrirDialogo}>Crear empleado</Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.nombre}</TableCell>
                  <TableCell>{e.apellido}</TableCell>
                  <TableCell>{e.documento}</TableCell>
                  <TableCell>{e.rol}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>
                  <IconButton 
                    onClick={() => handleEdit(empleado)} 
                    sx={{ color: 'gray', marginRight: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(empleado.id)} 
                    sx={{ color: 'gray' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openDialog} onClose={cerrarDialogo}>
        <DialogTitle>Crear nuevo empleado</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nombre" value={nuevoEmpleado.nombre} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })} />
          <TextField label="Apellido" value={nuevoEmpleado.apellido} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, apellido: e.target.value })} />
          <TextField label="Documento" value={nuevoEmpleado.documento} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, documento: e.target.value })} />
          <TextField label="Rol" value={nuevoEmpleado.rol} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, rol: e.target.value })} />
          <TextField label="Correo" value={nuevoEmpleado.correo} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, correo: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogo}>Cancelar</Button>
          <Button onClick={crearEmpleado} variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Empleados;
