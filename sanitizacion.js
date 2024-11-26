import validator from 'validator';

export class Sanitization {
    static email(email) {
        if (typeof email !== 'string') {
            throw new Error('El email debe ser una cadena');
        }
    
        // Paso 1: Eliminar espacios
        email = email.replace(/\s+/g, '');
    
        // // Paso 2: Validar el formato
        // if (!validator.isEmail(email)) {
        //     console.error(`El email sanitizado "${email}" no es válido.`);
        //     throw new Error('El email no es válido');
        // }
    
        // Paso 2: Normalizar el correo electrónico
        email = validator.normalizeEmail(email);
    
        return email; // Retornar email limpio
    }
    
    

    static password(password) {
        if (typeof password !== 'string') {
            throw new Error('La contraseña debe ser una cadena');
        }
        return password; // No hacemos cambios en la contraseña aquí
    }
}
