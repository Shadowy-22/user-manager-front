import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ImportMetaEnv } from '../types/config/vite-env';

// Tipo del payload del token
interface JwtPayload {
  userId: string;
}

interface User {
  userId: number; // Agregamos el ID del usuario al tipo
  firstName: string;
  lastName: string;
  username: string;
}

const useFetchUser = (): { user: User | null; isLoading: boolean; error: string | null } => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token no disponible');
        }

        // Decodificar el token para extraer el userId
        const decodedToken = jwtDecode<JwtPayload>(token);
        const userId = decodedToken.userId;

        // Realizar la solicitud GET
        const response = await axios.get(
          `${import.meta.env.VITE_CUENTAS_API_URL as ImportMetaEnv}users/${userId}?token=${token}`
        );

        // Combinar el userId con los datos obtenidos del usuario
        const userData: User = { ...response.data, userId };

        setUser(userData); // Actualizar el estado con los datos del usuario
      } catch (err: any) {
        setError(err.message || 'Error al obtener los datos del usuario');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading, error };
};

export default useFetchUser;
