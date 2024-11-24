import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Snackbar, Paper, useTheme } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import axios from 'axios';
import { ImportMetaEnv } from '../../types/config/vite-env';
import useRedirectLogin from '../../utils/useRedirectLogin';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import formValidation from '../../utils/formValidation';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login: React.FC = () => {
  // Verificamos si el usuario ya esta logeado
  useRedirectLogin();
  const navigate = useNavigate();
  const location = useLocation();
  
  const theme = useTheme(); 

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación antes de enviar el formulario
    const errorMessage = formValidation(username, password);

    if (errorMessage) {
      setErrorMessage(errorMessage);
      setOpenSnackbar(true);
      return;
    }

    // Intentamos hacer un llamado a la API 
    try {
      const loginUrl = `${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}login`; 
      
      const loginResponse = await axios.post(loginUrl, { username, password });

      if (loginResponse.status === 200) {

        // Verificamos que el usuario tenga autorizacion al sistema antes de redirigir.
        const authorizationUrl = `${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}authorize`;

        const authResponse = await axios.post(authorizationUrl, {
          token: loginResponse.data.token,
          systemId: 1
        });

        if(authResponse.data.authorized){
          setSuccessMessage('Usuario logeado exitosamente, redirigiendo..')
          setOpenSnackbar(true)
          sessionStorage.setItem('token', loginResponse.data.token);
          sessionStorage.setItem('userId', loginResponse.data.userId);
          sessionStorage.setItem('expiresIn', loginResponse.data.expiresIn);

          // Esperar 2 segundos antes de redirigir
          setTimeout(() => {
            navigate("/admin/users", { state: { from: location } });
          }, 2000);
        } else {
          setErrorMessage('Lo sentimos, usted no está autorizado a este sistema');
          setOpenSnackbar(true);
          sessionStorage.removeItem('token');
        }

        
      } else {
        setErrorMessage('Ocurrió un error inesperado. Intenta de nuevo más tarde.');
        console.log('hola');
        setOpenSnackbar(true);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Credenciales incorrectas.');
        } else {
          setErrorMessage('Ocurrió un error inesperado. Intenta de nuevo más tarde.');
        }
      } else {
        setErrorMessage('Error de conexión. Intenta de nuevo más tarde.');
      }
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', 
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '50%',
          alignItems: 'center',
          padding: '20px',
          borderRadius: '8px',
          width: '100%',
          boxShadow: theme.palette.mode === 'dark' ? theme.shadows[5] : theme.shadows[2] 
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleLogin} noValidate style={{marginTop: '3rem'}}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Correo Electrónico"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button size='large' type="submit" fullWidth variant="contained" color="primary" style={{marginTop: '2rem'}}>
            Iniciar Sesión
          </Button>
        </form>
        <Typography variant="body2" style={{ marginTop: '2rem'}}>
          ¿No tienes una cuenta? {' '}
          <Link 
            to="/register" 
            style={{
              color: theme.palette.primary.main,
              textDecoration: 'none', 
            }}
          >
            Regístrate
          </Link>
        </Typography>
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={successMessage ? "success" : "error"}>
            {successMessage || errorMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Login;
