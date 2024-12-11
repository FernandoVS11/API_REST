// Archivo de controlador para la entidad Profesor
const Profesor = require('../modelos/profesor_modelo');

// Validar los datos de un profesor
function validarProfesor(data) {
    const errores = [];
    const {numeroEmpleado, nombres, apellidos, horasClase } = data;

    if (!numeroEmpleado || !nombres || !apellidos || horasClase === undefined) {
        errores.push('Todos los campos son requeridos');
    }
    if (typeof horasClase !== 'number') {
        errores.push('Las horas de clase deben ser un número' );
    }
    return errores;
}

// Obtener todos los profesores
async function obtenerTodos() {
    return await Profesor.findAll();
}

// Obtener un profesor por ID
async function obtenerPorId(id) {
    return await Profesor.findByPk(id);
}

// Crear un nuevo profesor
async function crear(data) {
    const errores = validarProfesor(data);
    if (errores.length > 0) {
        return { errores, valido: false };
    }
    const nuevoProfesor = await Profesor.create(data);
    return { profesor: nuevoProfesor, valido: true };
}

// Actualizar un profesor
async function actualizar(id, data) {
    const profesor = await Profesor.findByPk(id);
    if (!profesor) {
        return { encontrado: false };
    }

    const errores = validarProfesor(data);
    if (errores.length > 0) {
        return { errores, valido: false };
    }

    const profesorActualizado = await profesor.update(data);
    return { profesor: profesorActualizado, valido: true, encontrado: true };
}

// Eliminar un profesor
async function eliminar(id) {
    const profesor = await Profesor.findByPk(id);
    if (!profesor) {
        return false;
    }
    await profesor.destroy();
    return true;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
};
