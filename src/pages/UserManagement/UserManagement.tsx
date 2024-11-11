import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Container,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowId, GridRowModesModel, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import axios from 'axios';
import { ImportMetaEnv } from '../../types/config/vite-env';
import { User, UserResponse } from '../../types/User/CrudTypes';

const UserManagement: React.FC = () => {
  const [rows, setRows] = useState<User[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<User>({ id: 0, name: '', lastName: '', email: '', password: '', systems: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Función para mapear los datos del backend al formato del frontend
  const mapUserData = (user: UserResponse): User => ({
    id: user.id,
    name: user.nombre,
    lastName: user.apellido,
    email: user.nombreUsuario,
    password: user.contrasenia,
    systems: user.rol,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_CUENTAS_CRUD_URL}users`);
        const mappedData = response.data.map(mapUserData);
        setRows(mappedData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ id: 0, name: '', lastName: '', email: '', password: '', systems: '' });
    setIsEditing(false);
  };

  const handleSave = async () => {
    const userPayload = {
      nombreUsuario: formData.email,
      contrasenia: formData.password,
      nombre: formData.name,
      apellido: formData.lastName,
      rol: formData.systems,
    };
  
    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_CUENTAS_CRUD_URL}editar${formData.id}`, userPayload);
      } else {
        const response = await axios.post(`${import.meta.env.VITE_CUENTAS_CRUD_URL}register`, userPayload);
        console.log(response.data)
      }
  
      handleClose();
      const response = await axios.get(`${import.meta.env.VITE_CUENTAS_CRUD_URL}users`);
      const mappedData = response.data.map(mapUserData);
      setRows(mappedData);
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  };
  

  const handleEditClick = (id: GridRowId) => () => {
    const user = rows.find((row) => row.id === id);
    if (user) {
      setFormData(user);
      setIsEditing(true);
      handleOpen();
    }
  };

  const handleDeleteClick = async (id: GridRowId) => {
    await axios.delete(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users/students/${id}`);
    setRows(rows.filter((row) => row.id !== id));
  };

  const processRowUpdate = (newRow: User) => {
    setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
    return newRow;
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'name', headerName: 'Nombre', flex: 1, editable: true },
    { field: 'lastName', headerName: 'Apellido', flex: 1, editable: true },
    { field: 'email', headerName: 'Email', flex: 1.5, editable: true },
    { field: 'password', headerName: 'Contraseña', flex: 1.5, editable: true },
    { field: 'systems', headerName: 'Sistemas con Acceso', flex: 1.5, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 150,
      getActions: ({ id }) => [
        <GridActionsCellItem icon={<EditIcon />} key={id} label="Editar" onClick={handleEditClick(id)} color="inherit" />,
        <GridActionsCellItem icon={<DeleteIcon />} key={id} label="Borrar" onClick={() => handleDeleteClick(id)} color="inherit" />,
      ],
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <h1>Gestión de Usuarios</h1>
      <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={handleOpen}>
        Agregar Usuario
      </Button>

      <Box sx={{ height: 500, width: '100%', mt: 2}}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={(model) => setRowModesModel(model)}
          processRowUpdate={processRowUpdate}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{color: "#040316"}}>{isEditing ? 'Editar Usuario' : 'Añadir Usuario'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Apellido"
            fullWidth
            margin="dense"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label="Contraseña"
            fullWidth
            margin="dense"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <TextField
            label="Sistemas con Acceso"
            fullWidth
            margin="dense"
            value={formData.systems}
            onChange={(e) => setFormData({ ...formData, systems: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">Cancelar</Button>
          <Button onClick={handleSave} color="primary">{isEditing ? 'Actualizar' : 'Guardar'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
