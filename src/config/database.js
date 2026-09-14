// Instancia de Sequelize: conexión a PostgreSQL.
// Se usa el cliente `pg` a través del ORM Sequelize.
// Credenciales tomadas de variables de entorno (.env) por seguridad.
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // poner console.log para ver el SQL generado
  }
);

// Verifica la conexión y deja log en consola al conectar con éxito.
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
    throw error;
  }
}

module.exports = { sequelize, testConnection };
