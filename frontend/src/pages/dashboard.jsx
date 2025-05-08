import React from "react";
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
} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/dashboard"; // importa tus estilos como objeto


const Dashboard = () => {
  const { user, userData, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const userName = user?.email?.split("@")[0] || "Usuario";
  const isAdmin = userData?.rol === "admin";

  return (
    <Box sx={styles.dashboardContainer}>
      <CssBaseline />

      <AppBar position="fixed" sx={styles.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {getGreeting()}, {userName}
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
            {isAdmin && (
              <ListItem button="true">

                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Base de datos empleados" />
              </ListItem>
            )}
            <ListItem button="true">
              <ListItemIcon><InventoryIcon /></ListItemIcon>
              <ListItemText primary="Base de datos productos" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Configuración de perfil" />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={styles.mainContent}>
        <Typography variant="h4" align="center" color="text.secondary">
          Seleccione una opción para continuar
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
