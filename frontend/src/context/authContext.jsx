// src/context/authContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error al obtener datos del usuario:', error);
        } else {
          setUserData(data);
        }
      } catch (err) {
        console.error('Error inesperado al obtener datos:', err);
      }
    };

    if (user) {
      getUserData();
    }

    setLoading(false); // Se mueve aquí fuera del `finally` y `else` para no ejecutarse repetidamente
  }, [user]);

  // Función logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      setUser(null); // Elimina el usuario de la sesión
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
