import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Obtén la ubicación actual
  const [dialogOpen, setDialogOpen] = useState(false);

  // Verificación inicial del token al cargar la página
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/', { state: { from: location } }); // Redirigir si no hay token
    }
  }, [navigate, location]);

  const handleLogout = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      };

      await axios.post(
        `${import.meta.env.VITE_CUENTAS_API_URL}logout`,
        null,
        config
      );

      // Mostrar el diálogo de cierre exitoso
      setDialogOpen(true);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleDialogClose = () => {
    // Borrar el token y redirigir al login
    sessionStorage.removeItem('token');
    setDialogOpen(false);
    navigate('/', { state: { from: location } });
  };

  return (
    <div>
      <Button onClick={handleLogout}>Cerrar Sesión</Button>
      <Dialog 
        open={dialogOpen} 
        onClose={() => {}} // Desactiva el cierre automático
      >
        <DialogTitle>Cierre de sesión exitoso</DialogTitle>
        <DialogContent>
            <Typography>Has cerrado sesión correctamente. Serás redirigido en breve.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Logout;
