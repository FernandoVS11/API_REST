const { DataTypes } = require('sequelize');
const sequelize  = require('../config/database.config');

// Definición del modelo Alumno
const Alumno = sequelize.define('Alumno', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombres: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    promedio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    fotoPerfilUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'alumnos',
    timestamps: true,
});

module.exports = Alumno;
