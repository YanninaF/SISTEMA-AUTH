# Sistema de Autenticación y Gestión de Sesiones 🔒💻

Este proyecto implementa un sistema de autenticación basado en JWT (JSON Web Token) con protección CSRF, manejo de sesiones y seguridad en el inicio de sesión. Permite a los usuarios registrarse, iniciar sesión, gestionar sesiones activas, y proteger las rutas sensibles mediante roles y validación de intentos fallidos.

## Características 🌟

- **Autenticación JWT**: Generación de tokens JWT para mantener sesiones seguras.
- **Protección CSRF**: Utiliza tokens CSRF para prevenir ataques de falsificación.
- **Gestión de sesiones**: Manejo de sesiones mediante cookies seguras y middleware.
- **Restricciones por roles**: Solo los usuarios con el rol adecuado pueden acceder a rutas específicas.
- **Bloqueo de intentos fallidos**: Prevención de ataques de fuerza bruta mediante bloqueo temporal por múltiples intentos fallidos.

## Tecnologías Utilizadas 🛠️

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para la creación de APIs.
- **JWT (JSON Web Token)**: Sistema de autenticación y autorización.
- **bcrypt**: Librería para la encriptación de contraseñas.
- **csurf**: Middleware de protección CSRF.
- **db-local**: Base de datos local para almacenar la información de los usuarios.
- **cookie-parser** y **express-session**: Gestión de sesiones con cookies seguras.

## Estructura del Proyecto 📂

- `config.js`: Configuraciones básicas del servidor, como el puerto y el número de rondas de encriptación.
- `index.js`: Configuración del servidor y definición de rutas.
- `user-repository.js`: Lógica para manejar los usuarios, su creación, inicio de sesión y validación.
- `intentos-login.js`: Manejo de intentos fallidos de inicio de sesión y bloqueo temporal.
- `sanitizacion.js`: Funciones para sanitizar entradas de usuario.
- `db/`: Carpeta que contiene la base de datos local en formato JSON.

## Instalación y Configuración 🚀

### Clonar el repositorio
git clone https://github.com/tu-usuario/sistema-autenticacion.git

# Configuración y ejecución del servidor

## Configurar variables de entorno

Define las siguientes variables en tu entorno:

- `PORT`: Puerto en el que el servidor estará corriendo (por defecto `3000`).
- `SALT_ROUNDS`: Número de rondas para el hash de contraseñas (por defecto `10`).

## Iniciar el servidor

Ejecuta el siguiente comando para iniciar el servidor:

node index.js


## Acceso y Uso de la Aplicación 🚀

### Acceder a la aplicación
Abre tu navegador y dirígete a `http://localhost:3000` para comenzar a gestionar tus sesiones de usuario.

### Uso de la Aplicación 👩‍💻

#### Funcionalidades principales:

* **Registro de usuario**: 
 Envía una solicitud POST a `/register` con los campos `email`, `password` y `role` para crear un nuevo usuario.

* **Inicio de sesión**: 
 Envía una solicitud POST a `/login` con `email` y `password` para autenticarte y obtener un token JWT.

* **Cierre de sesión**: 
 Envía una solicitud POST a `/logout` para finalizar la sesión y eliminar las cookies de autenticación.

* **Acceso restringido por rol**: 
 Utiliza rutas protegidas como `/usuarios`, accesibles solo para administradores.


## Contribuciones 🤝

¡Si tienes ideas o mejoras para el proyecto, puedes colaborar!


### Pasos para contribuir:

1. Haz un fork del repositorio
2. Realiza tus cambios
3. Envía un "pull request" para que tus modificaciones sean revisadas e integradas al proyecto


## Autor 👤

Desarrollado por YanninaF, apasionado por la programación y la seguridad en aplicaciones web. 

