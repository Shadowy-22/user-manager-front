export type User = {
    id: number;
    name: string;
    lastName: string;
    email: string;
    password: string;
    systems: string;
};
  
export type UserResponse = {
    id: number;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    contrasenia: string;
    rol: string;
};