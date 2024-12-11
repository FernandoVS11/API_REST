const express = require('express');
const {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} = require('../controlador/profesores_controlador');

const router = express.Router();

// Obtener todos los profesores
router.get('/', async (req, res) => {
    const profesores = await obtenerTodos();
    res.status(200).json(profesores);
});

// Obtener un profesor por ID
router.get('/:id', async (req, res) => {
    const profesor = await obtenerPorId(req.params.id);
    if (!profesor) {
        return res.status(404).json({ mensaje: 'Profesor no encontrado' });
    }
    res.status(200).json(profesor);
});

// Crear un nuevo profesor
router.post('/', async (req, res) => {
    const { profesor, valido, errores } = await crear(req.body);
    if (!valido) {
        console.log(errores)
        return res.status(400).json({ mensaje: 'Errores de validación', errores });
        
    }
    res.status(201).json(profesor);
});

// Actualizar un profesor
router.put('/:id', async (req, res) => {
    const { profesor, valido, errores, encontrado } = await actualizar(req.params.id, req.body);
    if (!valido) {
        return res.status(400).json({ mensaje: 'Errores de validación', errores });
    }
    res.status(200).json(profesor);
});

router.all('/', (req, res) => {
    if (req.method === 'DELETE') {
        res.status(405).json({ mensaje: 'Método DELETE no permitido en esta ruta.' });
    }
});

// Eliminar un profesor
router.delete('/:id', async (req, res) => {
    const exito = await eliminar(req.params.id);
    if (!exito) {
        return res.status(404).json({ mensaje: 'Profesor no encontrado para eliminar' });
    }
    res.status(200).json({ mensaje: 'Profesor eliminado exitosamente' });
});

module.exports = router;
