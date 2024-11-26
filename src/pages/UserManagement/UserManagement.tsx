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
import formValidation from '../../utils/formValidation.ts';
import useRedirectLogin from '../../utils/useRedirectLogin.ts';
import { User } from '../../types/User/CrudTypes.ts';
import { systems } from './UserData.ts';
import { ImportMetaEnv } from '../../types/config/vite-env';
import axios from 'axios';
import Logout from '../../components/Logout.tsx';
import { performCrudAction } from '../../utils/performCrudAction.ts';
import { useLocation, useNavigate } from 'react-router-dom';

const UserManagement: React.FC = () => {

  useRedirectLogin();
  const navigate = useNavigate();
  const location = useLocation();

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
  const [showPasswordField, setShowPasswordField] = useState(false);
  
  // Estados para la confirmacion del Dialog de borrado
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<GridRowId | null>(null);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);

  const axiosConfig = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  }), []);  

  const initialFormData: User = { id: 0, firstName: '', lastName: '', username: '', password: '', permisos: [] };

  const fetchUsers = useCallback(async () => {
    const action = async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users`, axiosConfig);
  
      const formattedData = data.map((user: User) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        permisos: Array.isArray(user.permisos) ? user.permisos : [],
      }));
  
      setRows(formattedData);
    };
  
    const resultMessage = await performCrudAction(action);
  
    if (resultMessage) {
      setIsTokenInvalid(true);
      setErrorMessage(resultMessage); // Mostrar el error en el diálogo
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSave = async () => {
    // Determinamos si es necesario validar la contraseña
    const validatePassword = !(isEditing && !showPasswordField);

    const validationError = formValidation(
      formData.username,
      formData.password, // Se puede pasar null si es opcional
      { name: formData.firstName, lastName: formData.lastName },
      formData.permisos.map((permission) => permission.systemId),
      validatePassword // Validamos solo si es necesario
    );

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const userPayload = {
      firstName: formData.firstName, 
      lastName: formData.lastName,   
      username: formData.username,     
      password: formData.password || null,  
      sistemaIds: formData.permisos.map(permission => permission.systemId) // Usamos solo el systemId
    };

    const action = async () => {
      if (isEditing) {
          await axios.put(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users/${formData.id}`, userPayload, axiosConfig);
      } else {
          await axios.post(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users`, userPayload, axiosConfig);
      }
    };

    const resultMessage = await performCrudAction(action);
    if (resultMessage) {
        setIsTokenInvalid(true);
        handleClose();
        setErrorMessage(resultMessage); // Mostrar mensaje en el diálogo
    } else {
        handleClose();
        fetchUsers(); // Actualizar la lista de usuarios
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setIsEditing(false);
    setErrorMessage(null);
  };

  // Redirigimos al usuario
  const handleCloseInvalid = () => {
    navigate('/', { state: { from: location } });
  }

  const handleDeleteClick = (id: GridRowId) => {
    setDeleteUserId(id); // Setteamos el usuario a borrar
    setDeleteDialogOpen(true); 
  };

  const confirmDelete = async () => {
    if (deleteUserId !== null) {
      const action = async () => {
        await axios.delete(`${import.meta.env.VITE_CUENTAS_CRUD_URL as ImportMetaEnv}users/${deleteUserId}`, axiosConfig);
      }

      const resultMessage = await performCrudAction(action);
        
      if (resultMessage) {
          handleClose();
          setIsTokenInvalid(true);
          setErrorMessage(resultMessage); // Mostrar mensaje en el diálogo
      } else {
          setRows(rows.filter((row) => row.id !== deleteUserId));
          setDeleteDialogOpen(false); 
          setDeleteUserId(null); 
          handleClose();
          fetchUsers(); // Actualizar la lista de usuarios
      }
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteUserId(null);
  };


  /* Material Grid Component */
  const processRowUpdate = (newRow: User) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? { ...newRow } : row)));
    return newRow;
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'firstName', headerName: 'Nombre', flex: 1 },
    { field: 'lastName', headerName: 'Apellido', flex: 1 },
    { field: 'username', headerName: 'Email', flex: 1.5 },
    {
      field: 'permisos',
      headerName: 'Sistemas con Acceso',
      flex: 1.5,
      editable: false,
      sortable: false,
      renderCell: (params) => {
        if (!params.row || !Array.isArray(params.row.permisos)) {
          return 'Sin permisos';
        }
        const permisos = params.row.permisos;
        return (
          <Box>
            {permisos.map((permission, index) => (
              <Typography key={permission.systemId} sx={{ display: 'inline' }}>
                {permission.name}
                {index < permisos.length - 1 ? ', ' : ''}
              </Typography>
            ))}
          </Box>
        );
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



  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
        <Typography variant="h5">Bienvenido/a, Usuario</Typography>
        <Logout />
      </Box>
      <Typography variant="h4" sx={{mb: 4}}>Gestión de Usuarios</Typography>
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
            
            {/* Lógica para el campo de contraseña */}
            
            {isEditing ? (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showPasswordField}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setShowPasswordField(isChecked);
                        if (!isChecked) {
                          // Limpiar la contraseña del formData si el campo se oculta
                          setFormData((prevData) => ({ ...prevData, password: "" }));
                        }
                      }}
                    />
                  }
                  label="Cambiar Contraseña"
                />
                {showPasswordField && (
                  <TextField
                    label="Contraseña"
                    fullWidth
                    type="password"
                    margin="dense"
                    value={formData.password || ""}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                    autoComplete="current-password"
                  />
                )}
              </>
            ) : (
              <TextField
                label="Contraseña"
                fullWidth
                type="password"
                margin="dense"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="new-password"
              />
            )}

            <FormGroup row sx={{ gap: 2, marginTop: 3 }}>
              {Object.keys(systems).map((key) => (
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

      {/* Dialogo de confirmacion de borrado */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar el usuario?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">Cancelar</Button>
          <Button onClick={confirmDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de error por token invalido */}
      <Dialog open={isTokenInvalid} onClose={() => setErrorMessage(null)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvalid}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
