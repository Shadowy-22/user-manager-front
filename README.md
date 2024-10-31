# Sistema de Gestion de Usuarios

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas en tu máquina:

1. **Node.js**: Necesitas tener Node.js instalado. Puedes descargarlo desde [nodejs.org](https://nodejs.org/). Asegúrate de elegir la versión LTS para mayor estabilidad.
2. **npm**: npm se instala automáticamente con Node.js. Esto es necesario para manejar las dependencias del proyecto.
3. **Git**: Si deseas clonar el repositorio, necesitas tener Git instalado. Puedes descargarlo desde [git-scm.com](https://git-scm.com/).

## ¿Cómo correr el proyecto?

1. **Descargar el repositorio o clonarlo con git clone:**
    ```bash
    git clone https://github.com/Shadowy-22/user-manager-front
    ```

2. **Navega al directorio del proyecto:**
    ```bash
    cd user-manager-front
    ```

3. **Instalar las dependencias con:**
    ```bash 
    npm install
    ```

4. **Ejecutar el proyecto:**
    ```bash
    npm run dev
    ```

5. **Abrir el navegador y acceder a la URL:**
    ```bash
    http://localhost:3000
    ```

Ahora, tu proyecto debería estar corriendo en local.

## Estructura de Carpetas: 
La estructura del proyecto está organizada de la siguiente manera para facilitar la colaboración y el mantenimiento:

    E:.
    │   .gitignore
    │   eslint.config.js
    │   folder_structure.txt
    │   index.html
    │   package-lock.json
    │   package.json
    │   README.md
    │   vite.config.js
    │
    ├───public                      // Archivos públicos como íconos y imágenes
    │       vite.svg
    │       
    └───src
        │   App.css
        │   App.jsx
        │   index.css
        │   main.jsx
        │
        ├───assets                  // Recursos estáticos como imágenes y archivos
        │       └───react.svg
        │
        ├───components              // Componentes reutilizables
        │       ├───Button.jsx
        │       ├───Input.jsx
        │       └───Header.jsx
        │
        ├───pages                   // Vistas o páginas principales
        │       ├───Login.jsx
        │       ├───Register.jsx
        │       └───UserManagement.jsx
        │
        ├───API                     // Lógica de negocio y llamadas a API
        │       ├───authService.js
        │       └───userService.js
        │
        └───utils                   // Funciones utilitarias y helpers
                └───validators.js

(Nota: Los archivos son meramente de ejemplos)

- **Descripción de Carpetas**
  
  - **public**: Contiene archivos públicos como íconos y cualquier recurso que deba ser accesible directamente.
  - **src**: La carpeta principal que contiene todo el código fuente de la aplicación.
  - **assets**: Recursos estáticos como imágenes y archivos.
  - **components**: Componentes reutilizables de la aplicación, facilitando su uso en diferentes partes de la misma.
  - **pages**: Contiene las vistas o páginas principales de la aplicación, como la página de inicio de sesión, registro y gestión de usuarios.
  - **API**: Aquí se encuentra la lógica de negocio y las llamadas a la API, gestionando la interacción entre el frontend y el backend.
  - **utils**: Funciones utilitarias y helpers que pueden ser utilizadas en diferentes partes del proyecto.

## Notas Adicionales

- **Recuerda crear una rama por cada feature** y, una vez que esté lista, abrir un Pull Request hacia la rama principal (`main`).

- **Configuración de CORS**: El equipo del backend debe asegurarse de que la API permita conexiones desde `http://localhost:3000` para que el frontend pueda hacer solicitudes durante el desarrollo local. Si la API se despliega en un entorno de producción, también deben considerar las configuraciones de CORS para los dominios correspondientes.

- **Consumo de la API**: El frontend se encargará de consumir la API proporcionada por el backend. Asegúrate de que tu equipo del backend comparta la URL y el puerto donde estará disponible la API.

- **Autenticación**: Cuando un usuario se autentique exitosamente, recibirás un token JWT. Este token debe ser almacenado (por ejemplo, en `localStorage` o `sessionStorage`) y enviado en el encabezado de autorización en todas las solicitudes que requieren autenticación.

  Ejemplo de cómo enviar el token en una solicitud:

    ```javascript
        import axios from 'axios';

        // Obtener el token almacenado
        const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado

        // Configuración de la solicitud
        const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Añadir el token al encabezado
        },
        };

        // Hacer la solicitud GET a la API
        axios.get('API_URL/user/userId', config)
        .then(response => {
            console.log(response.data); // Manejar la respuesta
        })
        .catch(error => {
            console.error('Error al hacer la solicitud:', error); // Manejar errores
        });

- **Manejo de Sesiones**: Si el token JWT expira,  manejar la lógica para redirigir al usuario a la página de inicio de sesión.
