const Alumno = require('../modelos/alumno_modelo');
const { subirArchivo } = require('../servicios/s3_servicio');
const { enviarNotificacion } = require('../servicios/sns_servicio');
const { guardarSesion, verificarSesion, finalizarSesion } = require('../servicios/dynamo_servicio');
const bcrypt = require('bcrypt');

// Validación de campos necesarios
function validarAlumno(data) {
    const errores = [];
    if (!data.nombres) errores.push("El campo 'nombres' es obligatorio.");
    if (!data.apellidos) errores.push("El campo 'apellidos' es obligatorio.");
    if (!data.matricula) errores.push("El campo 'matricula' es obligatorio.");
    if (!data.password) errores.push("El campo 'password' es obligatorio.");
    return { valido: errores.length === 0, errores };
}

// Obtener todos los alumnos
async function obtenerTodos() {
    return await Alumno.findAll();
}

// Obtener un alumno por ID
async function obtenerPorId(id) {
    return await Alumno.findByPk(id);
}

// Crear un nuevo alumno
async function crear(data) {
    const { valido, errores } = validarAlumno(data);
    if (!valido) return { valido, errores };

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    const alumno = await Alumno.create(data);
    return { valido: true, alumno };
}

// Actualizar un alumno
async function actualizar(id, data) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) return { encontrado: false };

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    await alumno.update(data);
    return { encontrado: true, alumno };
}

// Eliminar un alumno
async function eliminar(id) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) return false;

    await alumno.destroy();
    return true;
}

// Subir foto de perfil a S3
async function subirFotoPerfil(id, archivo) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) throw new Error('Alumno no encontrado');

    const url = await subirArchivo(archivo);
    alumno.fotoPerfilUrl = url;
    await alumno.save();
    return url;
}

// Enviar notificación por SNS
// Enviar notificación por SNS
async function enviarEmail(id) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) {
        const error = new Error('Alumno no encontrado');
        error.status = 404; // Agregar un status explícito
        throw error;
    }

    const mensaje = `Información del alumno:\nNombre: ${alumno.nombres} ${alumno.apellidos}\nMatricula: ${alumno.matricula}\nPromedio: ${alumno.promedio}`;
    await enviarNotificacion(mensaje);
    return { message: 'Notificación enviada' };
}

// Crear sesión de login
async function iniciarSesion(id, password) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno || !(await bcrypt.compare(password, alumno.password))) {
        throw new Error('Credenciales inválidas');
    }
    return await guardarSesion(id);
}

// Verificar sesión
async function verificarSesionActiva(sessionString) {
    return await verificarSesion(sessionString);
}

// Finalizar sesión
async function cerrarSesion(sessionString) {
    return await finalizarSesion(sessionString);
}
module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
    subirFotoPerfil,
    enviarEmail,
    iniciarSesion,
    verificarSesionActiva,
    cerrarSesion,

};
