const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database.config');
require('dotenv').config(); 

// Importar rutas de servicios
const alumnosRutas = require('./rutas/alumnos_rutas');
const profesorRutas = require('./rutas/profesor_rutas');

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());

// Conectar a la base de datos y sincronizar
async function initDB() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa.');
        await sequelize.sync({ alter: true }); // Crear las tablas si no existen
        console.log('Tablas sincronizadas correctamente.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

// Configurar rutas
app.use('/alumnos', alumnosRutas);
app.use('/profesores', profesorRutas);

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    await initDB();
});
