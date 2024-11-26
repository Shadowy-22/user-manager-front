import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useRedirectLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // Rutas públicas permitidas sin autenticación
    const publicRoutes = ["/", "/register"];

    // Verificar si el token y los datos de autenticación son válidos
    const isAuthenticated = token;

    if (!isAuthenticated) {
      // Si no está autenticado, permitir solo rutas públicas
      if (!publicRoutes.includes(location.pathname)) {
        navigate("/", { state: { from: location } });
      }
    } else {
      // Si está autenticado y accede a una ruta pública, redirigir al dashboard
      if (publicRoutes.includes(location.pathname)) {
        navigate("/admin/users");
      }
    }
  }, [navigate, location]);
};

export default useRedirectLogin;
