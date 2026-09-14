// Configuración de la aplicación Express (sin arrancar el servidor).
const express = require('express');
const path = require('path');
const apiRoutes = require('./routes');
const webRoutes = require('./routes/web.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');
const { log } = require('./services/log.service');

const app = express();

// Motor de vistas EJS (contenido web dinámico - módulo 6).
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parsers.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log simple de cada request en archivo plano.
app.use((req, res, next) => {
  log(`${req.method} ${req.originalUrl}`);
  next();
});

// Archivos estáticos: /public (css, assets) y /uploads (imágenes subidas).
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Vistas web (módulo 6).
app.use('/', webRoutes);

// API REST (módulos 7 y 8).
app.use('/api', apiRoutes);

// 404 y manejador de errores (siempre al final).
app.use(notFound);
app.use(errorHandler);

module.exports = app;
