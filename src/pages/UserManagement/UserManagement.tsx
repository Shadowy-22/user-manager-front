import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowId, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import axios from 'axios';
import { ImportMetaEnv } from '../../types/config/vite-env';
import { User, UserResponse } from '../../types/User/CrudTypes.ts';
import formValidation from '../../utils/formValidation.ts';
import { systems } from './UserData.ts';

const UserManagement: React.FC = () => {
  const [rows, setRows] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: '',
    lastName: '',
    email: '',
    password: '',
    systems: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const axiosConfig = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  }), []);

  const initialFormData: User = { id: 0, name: '', lastName: '', email: '', password: '', systems: [] };

  const mapUserData = (user: UserResponse): User => ({
    id: user.id,
    name: user.nombre,
    lastName: user.apellido,
    email: user.nombreUsuario,
    password: user.contrasenia,
    systems: user.permisos ?? []
  });

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users`, axiosConfig);
      setRows(data.map(mapUserData));
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setIsEditing(false);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    const validationError = formValidation(formData.email, formData.password, { name: formData.name, lastName: formData.lastName }, formData.systems);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const userPayload = {
      nombreUsuario: formData.email,
      contrasenia: formData.password,
      nombre: formData.name,
      apellido: formData.lastName,
      permisos: formData.systems,
    };

    console.log(userPayload)

    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users/${formData.id}`, userPayload, axiosConfig);
      } else {
        await axios.post(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}register`, userPayload, axiosConfig);
      }
      handleClose();
      fetchUsers();
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage('El correo electrónico ya está registrado.');
      } else {
        setErrorMessage('Ocurrió un error al guardar los datos.');
      }
    }
  };

  const handleEditClick = (id: GridRowId) => {
    const user = rows.find((row) => row.id === id);
    if (user) {
      setFormData(user);
      setIsEditing(true);
      handleOpen();
    }
  };

  const handleDeleteClick = async (id: GridRowId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users/${id}`, axiosConfig);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const processRowUpdate = (newRow: User) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? { ...newRow } : row)));
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
        <GridActionsCellItem icon={<EditIcon />} key={`edit-${id}`} label="Editar" onClick={() => handleEditClick(id)} color="inherit" />,
        <GridActionsCellItem icon={<DeleteIcon />} key={`delete-${id}`} label="Borrar" onClick={() => handleDeleteClick(id)} color="inherit" />,
      ],
    },
  ];

  const systemKeys = Object.keys(systems);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Gestión de Usuarios</Typography>
      <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={handleOpen}>
        Agregar Usuario
      </Button>

      <Box sx={{ height: 500, width: '100%', mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          processRowUpdate={processRowUpdate}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Editar Usuario' : 'Añadir Usuario'}</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
              autoComplete="username"
            />
            <TextField
              label="Contraseña"
              fullWidth
              type="password"
              margin="dense"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              autoComplete={isEditing ? "current-password" : "new-password"}
            />
            <FormGroup row sx={{ gap: 2, marginTop: 3 }}>
              {systemKeys.map((key) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.systems.includes(Number(key))}
                      onChange={(e) => {
                        const newSystems = e.target.checked
                          ? [...formData.systems, Number(key)]
                          : formData.systems.filter((s) => s !== Number(key));
                        setFormData({ ...formData, systems: newSystems });
                      }}
                    />
                  }
                  label={systems[Number(key)]}
                  key={key}
                />
              ))}
            </FormGroup>
            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <DialogActions>
              <Button onClick={handleClose} color="error">Cancelar</Button>
              <Button type="submit" color="primary">{isEditing ? 'Actualizar' : 'Guardar'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
