import axios from "axios";
import { ImportMetaEnv } from "../types/config/vite-env";

const isTokenValid = async (): Promise<boolean> => {
    
    const axiosConfig = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    }

    console.log(axiosConfig)

    try {
        await axios.get(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}isTokenValid`, axiosConfig);
        return true;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error("Token inválido o expirado.");
        }
        return false;
    }
};

export const performCrudAction = async (action: () => Promise<void>): Promise<string | null> => {
    const tokenIsValid = await isTokenValid();
    if (!tokenIsValid) {
        sessionStorage.removeItem('token');
        return "Token inválido o expirado. Por favor, inicie sesión nuevamente.";
    }
    try {
        await action();
        return null; // Acción realizada con éxito
    } catch (error) {
        console.error("Error durante la acción del CRUD:", error);
        return "Ocurrió un error al realizar la acción.";
    }
};