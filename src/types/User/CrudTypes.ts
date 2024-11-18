export type User = {
    id: number;
    firstName: string;
    lastName: string;
    username: string; // Email
    password: string;
    permisos: { name: string, systemId: number }[]
};
