export interface DecodedToken {
    userId: number;      // ID del usuario
    sub: string;         // Username (subject)
    exp: number;         // Fecha de expiración en segundos (por estándar JWT)
}