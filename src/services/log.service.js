// Persistencia en archivos planos (requisito módulo 6).
// Registra eventos y transacciones fallidas en logs/app.log y logs/transactions.log.
const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');

function ensureDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

function writeLine(file, message) {
  ensureDir();
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(path.join(LOG_DIR, file), line, 'utf8');
}

// Log general de la app (accesos, eventos).
function log(message) {
  writeLine('app.log', message);
}

// Log específico de transacciones fallidas (tarea PLUS módulo 7).
function logTransaction(message) {
  writeLine('transactions.log', message);
}

module.exports = { log, logTransaction };
