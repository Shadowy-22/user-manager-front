import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define el mapa de IDs de sistema
type SystemIdMap = {
    [key: string]: number;
};

const systemIdMap: SystemIdMap = {
    "/cuentas": 1,
    "/yimeil": 2,
    "/draiv": 3,
    "/k-lendar": 4,
};

const useAuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Memoizamos getSystemId para evitar que cambie en cada renderizado
    const getSystemId = useCallback((): number | null => {
        const path = `/${location.pathname.split("/")[1]}`; // Obtiene el primer segmento de la ruta y vuelve a formato `/ruta`
        return systemIdMap[path] || null; // Devuelve el systemId o null si no hay coincidencia
    }, [location.pathname]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const systemId = getSystemId();

        const authorizeUser = async () => {
            try {
                const response = await axios.post('/authorize', { token, systemId });
                if (!response.data.authorized) {
                    // Redirige a login si el usuario no está autorizado
                    navigate("/login", { state: { from: location } });
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Redirige a login en caso de error de autorización
                    navigate("/login", { state: { from: location } });
                }
            }
        };

        if (token && systemId) {
            // Autorizar si hay token y systemId válido
            authorizeUser();
        } else {
            // Redirige a login si falta el token o systemId no es válido
            if (location.pathname !== "/login") {
                navigate("/login", { state: { from: location } });
            }
        }
    }, [navigate, location, getSystemId]);

};

export default useAuthRedirect;
