import React, { useState, useEffect, useCallback } from 'react';
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
import { User } from '../../types/User/CrudTypes.ts';
import formValidation from '../../utils/formValidation.ts';
import { systems } from './UserData.ts';

const UserManagement: React.FC = () => {
  const [rows, setRows] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    permisos: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // TODO For token
  // const axiosConfig = useMemo(() => ({
  //   headers: {
  //     Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  //   },
  // }), []);  

  const initialFormData: User = { id: 0, firstName: '', lastName: '', username: '', password: '', permisos: [] };

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users`);
      console.log('Datos obtenidos:', data);  // Verifica los datos antes de asignarlos
     
      // Asegurarse de que los datos estén correctamente formateados
      const formattedData = data.map((user: User) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: user.password,
        permisos: Array.isArray(user.permisos) ? user.permisos : [],  // Asegura que permisos siempre sea un arreglo
      }));
      
      // Establecer los datos en rows
      setRows(formattedData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }, []);

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
    const validationError = formValidation(formData.username, formData.password, { name: formData.firstName, lastName: formData.lastName }, formData.permisos.map(permission => permission.systemId));

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const userPayload = {
      firstName: formData.firstName, 
      lastName: formData.lastName,   
      username: formData.username,     
      password: formData.password,  
      sistemaIds: formData.permisos.map(permission => permission.systemId) // Usamos solo el systemId
    };
    

    console.log(userPayload)

    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users/${formData.id}`, userPayload);
      } else {
        const response = await axios.post(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users`, userPayload);
        console.log(response.data)
        console.log(response.status)
      }
      handleClose();
      fetchUsers();
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage('El correo electrónico ya está registrado.');
      } else {
        console.error(error)
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
      await axios.delete(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users/${id}`);
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
    { field: 'firstName', headerName: 'Nombre', flex: 1 },
    { field: 'lastName', headerName: 'Apellido', flex: 1 },
    { field: 'username', headerName: 'Email', flex: 1.5 },
    { field: 'password', headerName: 'Contraseña', flex: 1.5 },
    {
      field: 'permisos',
      headerName: 'Sistemas con Acceso',
      flex: 1.5,
      editable: false,
      valueGetter: (params: { row: User }) => {
        // Verificar si params.row existe
        if (!params.row || !Array.isArray(params.row.permisos)) {
          console.warn('Fila de datos está indefinida o permisos no está disponible:', params);
          return 'Sin permisos';
        }
      
        const permisos = params.row.permisos;
        return permisos.map((permission) => permission.name).join(', ') || 'Sin permisos';
      }
    },
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
          rows={rows && rows.length > 0 ? rows : []} 
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
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                      checked={formData.permisos.some(permission => permission.systemId === Number(key))}
                      onChange={(e) => {
                        const newPermissions = e.target.checked
                          ? [...formData.permisos, { name: systems[Number(key)], systemId: Number(key) }]
                          : formData.permisos.filter((permission) => permission.systemId !== Number(key));
                        setFormData({ ...formData, permisos: newPermissions });
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
