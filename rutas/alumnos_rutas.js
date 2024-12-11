const express = require('express');
const multer = require('multer');
const {Sequelize}  = require('../config/database.config');
const {
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
} = require('../controlador/alumnos_controlador');

// Configurar multer para manejar la subida de archivos

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Obtener todos los alumnos
router.get('/', async (req, res) => {
    try {
        const alumnos = await obtenerTodos();
        res.status(200).json(alumnos);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener alumnos', error: error.message });
    }
});

// Obtener un alumno por ID
router.get('/:id', async (req, res) => {
    try {
        const alumno = await obtenerPorId(req.params.id);
        if (!alumno) return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        res.status(200).json(alumno);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener el alumno', error: error.message });
    }
});

// Crear un nuevo alumno
router.post('/', async (req, res) => {

    const { valido, alumno , errores} = await crear(req.body);
    if (!valido) return res.status(400).json({ mensaje: 'Errores de validación', errores });
    res.status(201).json(alumno);
});

// Actualizar un alumno
router.put('/:id', async (req, res) => {
    try {
        const { encontrado, alumno } = await actualizar(req.params.id, req.body);
        if (!encontrado) return res.status(404).json({ mensaje: 'Alumno no encontrado para actualizar' });

        res.status(200).json(alumno);
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).json({
                mensaje: 'Error de validación de datos',
                errores: error.errors.map((e) => e.message),
            });
        }
        res.status(500).json({ mensaje: 'Error al actualizar el alumno', error: error.message });
    }
});

// Eliminar un alumno
router.delete('/:id', async (req, res) => {
    try {
        const exito = await eliminar(req.params.id);
        if (!exito) return res.status(404).json({ mensaje: 'Alumno no encontrado para eliminar' });

        res.status(200).json({ mensaje: 'Alumno eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el alumno', error: error.message });
    }
});

// Subir foto de perfil
router.post('/:id/fotoPerfil', upload.single('foto'), async (req, res) => {
    try {
        const urlFotoPerfil = await subirFotoPerfil(req.params.id, req.file);
        res.status(200).json({ fotoPerfilUrl: urlFotoPerfil });
        console.log(urlFotoPerfil)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al subir la foto de perfil', error: error.message });
    }
});

// Enviar email de notificación
router.post('/:id/email', async (req, res) => {
    try {
        const resultado = await enviarEmail(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        if (error.status === 404) {
            res.status(404).json({ mensaje: 'Alumno no encontrado' });
        } else {
            res.status(500).json({ mensaje: 'Error al enviar la notificación', error: error.message });
        }
    }
});

router.post('/:id/session/login', async (req, res) => {
    try {
        const { password } = req.body;
        const resultado = await iniciarSesion(req.params.id, password);
        res.status(200).json({ mensaje: 'Sesión iniciada', session: resultado });
        console.log(resultado)
    } catch (error) {
        console.log(error)
        res.status(400).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
});

// Verificar sesión activa
router.post('/:id/session/verify', async (req, res) => {
    try {
        const { sessionString } = req.body;
       
        console.log(sessionString, "3")
        const resultado = await verificarSesionActiva(sessionString);
        console.log(resultado)
        res.status(200).json({ mensaje: 'Sesión verificada', estado: resultado });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al verificar sesión', error });
    }
});

// Cerrar sesión
router.post(':id/session/logout', async (req, res) => {
    try {
        const { sessionString } = req.body;
        const resultado = await cerrarSesion(sessionString);
        console.log(resultado)
        res.status(200).json({ mensaje: 'Sesión cerrada', resultado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cerrar la sesión', error });
    }
});

// Manejo de método DELETE no permitido en la ruta raíz
router.all('/', (req, res) => {
    if (req.method === 'DELETE') {
        res.status(405).json({ mensaje: 'Método DELETE no permitido en esta ruta.' });
    }
});

module.exports = router;
