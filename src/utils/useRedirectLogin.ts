import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useRedirectLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // Si no hay token, redirigir al login.
    if (!token) {
      // Permitir acceso a /register sin token
      if (location.pathname === "/register") {
        return;
      }

      if (location.pathname !== "/login") {
        navigate("/login", { state: { from: location } });
      }
      return;
    }

    // Si hay token y el usuario intenta ir a /login o /register, redirigir al dashboard (/).
    if (token && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/");
      return;
    }
  }, [navigate, location]);
};

export default useRedirectLogin;
