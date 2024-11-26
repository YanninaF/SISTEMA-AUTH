import express from 'express';
import jwt from 'jsonwebtoken';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import {PORT} from './config.js';
import { RepositorioUsuarios} from './user-repository.js';
import { verificarIntentosInicioSesion, incrementarIntentoFallido, restablecerIntentos } from './intentos-login.js';
import { Sanitization } from './sanitizacion.js';

const app = express();
const SECRET_JWT_KEY = 'tu_jwt_secreto';
const csrfProtection = csrf({ cookie: true });

// //middleware -- una funcion que se ejecuta antes de que llegue a la peticion 
app.use(cookieParser())
app.use(express.json())
app.use(session({
        secret: 'clave_secreta_sesion',
        name: 'sessionId', //iden sesion act
        cookie: {
        httpOnly: true, 
        secure: false,
        maxAge: 3600000 // 1 hora
        },
        resave: false,
        saveUninitialized: false
    }));
    app.use(csrfProtection);


    // Endpoint para obtener el token CSRF 
    app.get('/csrf-token', (req, res) => {  //Validarlo en cada petición que modifique datos
        res.json({ csrfToken: req.csrfToken() });
    });


// Ruta de registro
app.post('/register', csrfProtection, async (req, res) => {
    try {
        // Sanitizar datos del cuerpo de la solicitud
        const email = Sanitization.email(req.body.email);
        const password = Sanitization.password(req.body.password);
        const role = req.body.role; // En este caso No sanitización 

        // Registrar al usuario
        const id = await RepositorioUsuarios.create({ email, password, role });
        res.send({ id });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        // Sanitizar los datos
        const email = Sanitization.email(req.body.email);
        const password = Sanitization.password(req.body.password);

        // Verificar intentos de inicio de sesión y autenticar
        const { bloqueado, tiempoRestante } = verificarIntentosInicioSesion(email);
        if (bloqueado) {
            return res.status(403).send(`Demasiados intentos fallidos. Intenta de nuevo en ${Math.ceil(tiempoRestante / 1000)} segundos.`);
        }

        const usuario = await RepositorioUsuarios.login({ email, password });
        restablecerIntentos(email);


    // Guardar datos en la sesión
    req.session.usuarioId = usuario._id;
    req.session.role = usuario.role;
    req.session.email = usuario.email;
    
    // Generar y guardar token JWT en cookie 
    const token = jwt.sign({ usuarioId: usuario._id, role: usuario.role }, SECRET_JWT_KEY, {
        expiresIn: '2h',
    });

      // Cookie para el token JWT
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000
    });

    res.send({ 
        message: 'Inicio de sesión exitoso',
        usuario: {
        email: usuario.email,
        role: usuario.role,
        token: token
        }
    });
    } catch (error) {
    incrementarIntentoFallido(email);
    res.status(401).send(error.message);
    }
});

  // Ruta de de cierre de sesion
app.post('/logout', (req, res) => {
    // Destruir la sesión
    req.session.destroy(err => {
    if (err) {
        return res.status(500).send('Error al cerrar sesión');
    }
    
      // Limpiar cookies de autenticación
    res.clearCookie('token');
    res.clearCookie('sesionId');
    
    res.send({ message: 'Sesión cerrada correctamente' });
    });
});

// Middleware de autenticación combinado
function autenticar(req, res, next) {
    // Verificar sesión
    if (!req.session.usuarioId) {
    return res.status(401).send('No hay sesión activa');
    }

    // Verificar token JWT en cookie
    const token = req.cookies.token;
    if (!token) {
    return res.status(401).send('No hay token');
    }

    jwt.verify(token, SECRET_JWT_KEY, (err, decoded) => {
    if (err) {
        return res.status(403).send('Token inválido o expirado');
    }
    
    // Verificar que el token corresponde a la sesión actual
    if (decoded.usuarioId !== req.session.usuarioId) {
        return res.status(403).send('Token no corresponde a la sesión actual');
    }

    req.usuario = {
        usuarioId: req.session.usuarioId,
        role: req.session.role,
        email: req.session.email,

    };
    next();
    });
}

  // Middleware para verificar roles  
function autorizarRol(role) {
    return (req, res, next) => {
    if (req.usuario.role !== role) {
        return res.status(403).send('No tienes permiso para acceder a esta ruta');
    }
    next();
    };
}

  // Ruta para obtener usuarios (solo admin)
app.get('/usuarios', autenticar, autorizarRol('admin'), async (req, res) => {
    try {
    const usuarios = await RepositorioUsuarios.getAllUsers();
    res.json(usuarios);
    } catch (error) {
    res.status(500).send('Error al obtener los usuarios');
    }
});

  // Ruta para obtener datos de la sesión actual
app.get('/session', autenticar, (req, res) => {
    res.json({
    datosSesion: {
        usuarioId: req.session.usuarioId,
        role: req.session.role,
        email: req.session.email
    },
    preferences: req.cookies.preferenciaUsuario
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});