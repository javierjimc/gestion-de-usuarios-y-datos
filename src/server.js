// Punto de entrada: conecta a la DB, sincroniza modelos y arranca el servidor.
require('dotenv').config();
const app = require('./app');
const { sequelize, testConnection } = require('./config/database');
require('./models'); // registra modelos y asociaciones

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await testConnection();

    // Sincroniza el esquema (crea tablas si no existen).
    // alter:true ajusta columnas en desarrollo. En producción usar migraciones.
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      console.log(`   Web:  http://localhost:${PORT}/`);
      console.log(`   API:  http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err.message);
    process.exit(1);
  }
}

start();
