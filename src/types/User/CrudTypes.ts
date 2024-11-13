export type User = {
    id: number;
    name: string;
    lastName: string;
    email: string;
    password: string;
    systems: number[];
};
  
export type UserResponse = {
    id: number;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    contrasenia: string;
    permisos: number[];
};

