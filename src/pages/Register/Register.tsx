import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Snackbar, Paper, useTheme } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import axios from 'axios';
import { ImportMetaEnv } from '../../types/config/vite-env';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import formValidation from '../../utils/formValidation';
import useRedirectLogin from '../../utils/useRedirectLogin';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Register: React.FC = () => {
  // Verificamos si el usuario ya esta logeado
  useRedirectLogin();

  const navigate = useNavigate();
  const location = useLocation();
  
  const theme = useTheme(); 

  const [fullName, setFullname] = useState<{ name: string; lastName: string }>({
    name: '',
    lastName: ''
  });
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccessMessage(null);
    setErrorMessage(null);
    
    // Validación antes de enviar el formulario
    const errorMessage = formValidation(email, password, fullName);

    if (errorMessage) {
      setErrorMessage(errorMessage);
      setOpenSnackbar(true);
      return;
    }

    // Intentamos hacer un llamado a la API 
    // TODO: Reemplazar con la URL correspondiente
    try {
      const registerUrl = `${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}register`; 

      const response = await axios.post(registerUrl, { 
        username: email, 
        password: password,
        firstName: fullName.name, 
        lastName: fullName.lastName,  
      });

      if (response.status === 200) {
        // Redirigimos al usuario
        setSuccessMessage('Registrado correctamente');
        setOpenSnackbar(true);

        // Esperar 2 segundos antes de redirigir
        setTimeout(() => {
          navigate("/login", { state: { from: location } });
        }, 2000);

      } else {
        setErrorMessage('Ocurrió un error inesperado. Intenta de nuevo más tarde.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      if (error.response) {
        console.log(error)
        setErrorMessage('Ocurrió un error. Intenta de nuevo más tarde.');
      } else {
        setErrorMessage('Error de conexión. Intenta de nuevo más tarde.');
      }
      setOpenSnackbar(true);
    }
  };

  // Actualizar estado de nombre y apellido
  const handleChangeFullName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'name' | 'lastName') => {
    setFullname(prevState => ({
      ...prevState,
      [field]: e.target.value
    }));
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
          height: '65%',
          alignItems: 'center',
          padding: '35px',
          borderRadius: '8px',
          width: '100%',
          boxShadow: theme.palette.mode === 'dark' ? theme.shadows[5] : theme.shadows[2] 
        }}
      >
        <Typography component="h1" variant="h5">
          Formulario de Registro
        </Typography>
        <form onSubmit={handleRegister} noValidate style={{marginTop: '3rem'}}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nombre"
            type="text"
            value={fullName.name}
            onChange={(e) => handleChangeFullName(e, 'name')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Apellido"
            type="text"
            value={fullName.lastName}
            onChange={(e) => handleChangeFullName(e, 'lastName')}
          />
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
            autoComplete="new-password"
          />
          <Button size='large' type="submit" fullWidth variant="contained" color="primary" style={{marginTop: '2rem'}}>
            Registrar
          </Button>
        </form>
        <Typography variant="body2" sx={{ marginTop: '2rem'}}>
          ¿Ya tienes una cuenta? {' '}
          <Link 
            to="/login" 
            style={{
              color: theme.palette.primary.main,
              textDecoration: 'none', 
            }}
          >
            Inicia Sesión
          </Link>
        </Typography>
        <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={successMessage ? "success" : "error"}>
            {successMessage || errorMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Register;
