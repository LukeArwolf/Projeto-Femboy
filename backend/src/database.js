const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || path.join(__dirname, '../fitness_c2.db'),
    logging: false,
    define: {
        timestamps: true,
        paranoid: true, // Habilita Soft Delete por padrão
    }
});

module.exports = sequelize;
