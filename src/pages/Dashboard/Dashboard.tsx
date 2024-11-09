import React from 'react'
import useRedirectLogin from '../../utils/useRedirectLogin'
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EmailIcon from '@mui/icons-material/Email';
import FolderIcon from '@mui/icons-material/Folder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Dashboard = () => {
  const navigate = useNavigate();
  const opciones = [
    {
      nombre: "Admin",
      enlace: "/cuentas",
      icon: <AssignmentIndIcon
        sx={{
          height: "15vh",
          width: "15vw"
        }}
      />
    },
    {
      nombre: "Yimeil",
      enlace: "/yimeil",
      icon: <EmailIcon
        sx={{
          height: "15vh",
          width: "15vw",
        }}
      />
    },
    {
      nombre: "Draiv",
      enlace: "/draiv",
      icon: <FolderIcon
        sx={{
          height: "15vh",
          width: "15vw",
        }}
      />
    },
    {
      nombre: "K-Lendar",
      enlace: "/k-lendar",
      icon: <CalendarMonthIcon
        sx={{
          height: "15vh",
          width: "15vw",
        }}
      />
    },
  ];
  useRedirectLogin();

  return (
    <div >
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
        useFlexGap
        sx={{
          flexWrap: 'wrap',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {opciones.map((opcion, index) => (
          <Card
            sx={{
              minWidth: 275,
              m: 1,
              cursor: 'pointer',
              transition: '0.3s',
              borderRadius: '60px',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: 100,
              },
            }}
            key={index}
            onClick={() => navigate(opcion.enlace)}
          >
            <CardContent sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center', // Opcional: centra el texto dentro de cada elemento
            }}>
              <Box color="blue" className="contenedorIconos">
                {opcion.icon}
              </Box>
              <Typography variant="h5" component="div" color="red">
                {opcion.nombre}
              </Typography>

            </CardContent>
          </Card>
        ))}
      </Stack>
    </div >
  )
}

export default Dashboard
