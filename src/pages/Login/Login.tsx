import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Snackbar, Paper, useTheme } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import axios from 'axios';
import useAuthRedirect from '../../utils/useRedirect';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login: React.FC = () => {
  // Verificamos si el usuario ya esta logeado
  useAuthRedirect();
  const theme = useTheme(); // Get the current theme

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validacion de campos
    if (!username || !password) {
      setErrorMessage('Por favor, llena todos los campos.');
      setOpenSnackbar(true);
      return;
    }

    if (!username.endsWith('@guggle.com')) {
      setErrorMessage('El correo electrónico debe terminar con @guggle.com.');
      setOpenSnackbar(true);
      return;
    }

    // Intentamos hacer un llamado a la API 
    // TODO: Reemplazar con la URL correspondiente
    try {
      const loginUrl = `${import.meta.env.VITE_CUENTAS_API_URL}login`;
      console.log(loginUrl)

      const response = await axios.post(loginUrl, { username, password });

      if (response.status === 201) {
        // Guardamos el token, id y el usuario en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expiresIn', response.data.expiresIn);
        localStorage.setItem('userId', response.data.userId);
        // Redirigimos al usuario
        console.log('Login successful:', response.data);
        
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
        <Typography component="h1" variant="h5" style={{color: '#040316'}}>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleLogin} noValidate style={{marginTop: '5rem'}}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Correo Electrónico"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button size='large' type="submit" fullWidth variant="contained" color="primary" style={{marginTop: '2rem'}}>
            Iniciar Sesión
          </Button>
        </form>
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
