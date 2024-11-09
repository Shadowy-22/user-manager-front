import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useRedirectLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            navigate("/")
        } else {
            navigate("/login", { state: { from: location } });
        }
    }, [navigate, location]);
};

export default useRedirectLogin;