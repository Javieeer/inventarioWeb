import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/authContext.jsx';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient.js";
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Empleados from './pages/empleados';
import Productos from './pages/productos';
import ConfigPerfil from './pages/configPerfil';
import NuevoEmpleado from './pages/nuevoEmpleado';
import NuevoProducto from './pages/nuevoProducto';
import EditarEmpleado from './pages/editarEmpleado';
import { Mensaje } from './context/mensaje.jsx';

function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login"); // o donde tengas tu ruta de login
      }
    };

    checkSession();
  }, []);


  if (loading) return <p>Cargando...</p>;

  return (
    <Mensaje>
      <Routes>
        {/* Si no hay usuario, se muestra Login */}
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        <Route path="/login" element={user ? <Dashboard /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
        <Route path="/empleados" element={user ? <Empleados /> : <Login />} />
        <Route path="/productos" element={user ? <Productos /> : <Login />} />
        <Route path="/configPerfil" element={user ? <ConfigPerfil /> : <Login />} />
        <Route path="/nuevoEmpleado" element={user ? <NuevoEmpleado /> : <Login />} />
        <Route path="/nuevoProducto" element={user ? <NuevoProducto /> : <Login />} />
        <Route path="/editarEmpleado/:id" element={user ? <EditarEmpleado /> : <Login />} />
      </Routes>
    </Mensaje>
  );
}

export default App;
