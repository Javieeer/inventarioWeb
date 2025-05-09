import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/authContext.jsx';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Empleados from './pages/empleados';
import Productos from './pages/productos';
import ConfigPerfil from './pages/configPerfil';
import NuevoEmpleado from './pages/nuevoEmpleado';
import NuevoProducto from './pages/nuevoProducto';

function App() {
  const { user, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;

  return (
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
    </Routes>
  );
}

export default App;
