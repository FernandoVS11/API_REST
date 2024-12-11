const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

// Definición del modelo Profesor
const Profesor = sequelize.define('Profesor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    numeroEmpleado: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    nombres: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    horasClase: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'profesores',
    timestamps: true,
});

module.exports = Profesor;
