// Crea la base de datos si no existe.
// Sequelize no puede crear la DB por sí mismo (necesita que exista),
// por eso usamos el cliente `pg` conectándonos a la base 'postgres'
// del sistema y ejecutando CREATE DATABASE.
require('dotenv').config();
const { Client } = require('pg');

async function initDb() {
  const dbName = process.env.DB_NAME;
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres', // base por defecto para poder crear otras
  });

  try {
    await client.connect();
    const res = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Base de datos "${dbName}" creada.`);
    } else {
      console.log(`ℹ️  La base de datos "${dbName}" ya existe.`);
    }
  } catch (err) {
    console.error('❌ Error creando la base de datos:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  initDb();
}

module.exports = initDb;
