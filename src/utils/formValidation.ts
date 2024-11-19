function formValidation(
  email: string,
  password: string | null, // Permitimos null para omitir validación condicionalmente
  fullName?: { name: string; lastName: string },
  permisos?: number[],
  validatePassword: boolean = true // Nuevo parámetro para controlar si se valida la contraseña
): string | null {
  // Validación de campos vacíos
  if (!email || (validatePassword && !password) || (fullName && (!fullName.name || !fullName.lastName))) {
    return 'Por favor, llena todos los campos.';
  }

  // Validación de formato de email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gugle\.com$/;
  if (!emailRegex.test(email)) {
    return 'El correo electrónico debe terminar con @gugle.com.';
  }

  // Validación de password (solo si validatePassword es true)
  if (validatePassword && password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y un carácter especial.';
    }
  }

  // Validación de permisos (Si están definidos)
  if (permisos && permisos.length > 0) {
    const validSystems = [1, 2, 3, 4];
    // Verificar que todos los permisos sean números válidos (entre 1 y 4)
    const permisosInvalidos = permisos.some((permiso) => !validSystems.includes(permiso));
    if (permisosInvalidos) {
      return 'Los permisos deben ser números entre 1 y 4.';
    }
  }

  // Si todo está bien, retornar null
  return null;
}

export default formValidation;
