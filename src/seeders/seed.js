// Semilla de datos: crea usuarios, perfiles, productos y pedidos con relaciones.
// Ejecutar: npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Profile, Product, Order } = require('../models');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // reinicia el esquema
    console.log('🔄 Esquema recreado.');

    const pass = await bcrypt.hash('123456', 10);

    // Usuarios (>= 3 registros) con perfil 1:1.
    const [ana, luis, admin] = await Promise.all([
      User.create({ nombre: 'Ana Torres', email: 'ana@mail.com', password: pass }),
      User.create({ nombre: 'Luis Gómez', email: 'luis@mail.com', password: pass }),
      User.create({ nombre: 'Admin', email: 'admin@mail.com', password: pass, rol: 'admin' }),
    ]);

    await Promise.all([
      Profile.create({ userId: ana.id, bio: 'Diseñadora', telefono: '111-111' }),
      Profile.create({ userId: luis.id, bio: 'Cliente frecuente', telefono: '222-222' }),
      Profile.create({ userId: admin.id, bio: 'Administrador del sistema' }),
    ]);

    // Productos.
    const [teclado, mouse, monitor] = await Promise.all([
      Product.create({ nombre: 'Teclado mecánico', precio: 49.99, stock: 20 }),
      Product.create({ nombre: 'Mouse inalámbrico', precio: 25.5, stock: 35 }),
      Product.create({ nombre: 'Monitor 24"', precio: 189.0, stock: 10 }),
    ]);

    // Pedidos (1:N) con productos (N:M vía tabla intermedia con cantidad).
    const pedido1 = await Order.create({ userId: ana.id, total: 75.49, estado: 'pagado' });
    await pedido1.addProductos([teclado, mouse], { through: { cantidad: 1 } });

    const pedido2 = await Order.create({ userId: luis.id, total: 189.0 });
    await pedido2.addProducto(monitor, { through: { cantidad: 1 } });

    console.log('✅ Datos de prueba insertados.');
    console.log('   Login de prueba: ana@mail.com / 123456  (admin@mail.com para rol admin)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en el seed:', err.message);
    process.exit(1);
  }
}

seed();
