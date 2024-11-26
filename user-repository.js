//cumpla el mismo contrato
import dbLocal from 'db-local';
const { Schema } = new dbLocal ({path: './db'});
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { SALT_ROUNDS } from './config.js';

const Usuario = Schema('Usuario', {
    _id: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true, default: 'usuario'}
});

export class RepositorioUsuarios{
    static async create({email, password, role = 'usuario'}){

        Validation.email(email)
        Validation.password(password)

        //asegurarse que el email no existe
        const usuExis = Usuario.findOne({ email });
        if (usuExis) throw new Error('El email ya existe');

        const id = crypto.randomUUID()    
        //hash password/SALT_ROUNDS = 10 para generar el pass codificado  
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS) // hashSync bloquea el thread principal
        Usuario.create({
            _id: id,
            email,
            password: hashedPassword,
            role,
        }).save();
        return id;

    }
    static async login ({email, password}){
        Validation.email(email)
        Validation.password(password)

        const usuario = Usuario.findOne({ email })
        if (!usuario) throw new Error('El email no existe')
        
        const isValid = await bcrypt.compare(password, usuario.password);
        if (!isValid) throw new Error('La contraseña es inválida');
        
        const {password: _, ...usuarioPublico} = usuario;

        return usuarioPublico;       
    
    }
    static async getAllUsers() {
        // Suponiendo que User.find() retorna todos los usuarios
        return Usuario.find(); // Excluye el campo 'password' por seguridad
    
}
}

class Validation {
    static email (email){
        if (typeof email !== 'string' ) throw new Error('El email debe ser una cadena')
        if (email.length < 3) throw new Error('El email debe tener más de 3 caracteres');
    }

    static password(password){
        if (typeof password !== 'string') throw new Error('La contraseña debe ser una cadena')   
        if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres')
    }
}