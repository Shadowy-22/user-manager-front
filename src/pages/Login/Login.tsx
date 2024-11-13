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

  // TODO: Revisar el texto en darkmode del autocomplete

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación antes de enviar el formulario
    const errorMessage = formValidation(email, password);

    if (errorMessage) {
      setErrorMessage(errorMessage);
      setOpenSnackbar(true);
      return;
    }

    // Intentamos hacer un llamado a la API 
    // TODO: Reemplazar con la URL correspondiente
    try {
      const loginUrl = `${import.meta.env.VITE_CUENTAS_API_URL as ImportMetaEnv}login`; 

      const response = await axios.post(loginUrl, { email, password });

      if (response.status === 200) {
        // Guardamos el token, id y el usuario en localStorage
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('userId', response.data.expiresIn);
        sessionStorage.setItem('expiresIn', response.data.userId);
        // Redirigimos al usuario
        navigate("/", { state: { from: location } });
      } else {
        setErrorMessage('Ocurrió un error inesperado. Intenta de nuevo más tarde.');
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Alert onClose={handleCloseSnackbar} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Login;
