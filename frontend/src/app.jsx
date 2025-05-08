import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/authContext.jsx';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

function App() {
  const { user, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;

  return (
    <Routes>
      {/* Si no hay usuario, se muestra Login */}
      <Route path="/" element={user ? <Dashboard /> : <Login />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
    </Routes>
  );
}

export default App;
