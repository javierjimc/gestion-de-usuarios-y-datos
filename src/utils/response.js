// Formato de respuesta consistente para toda la API: { status, message, data }.
function success(res, { message = 'OK', data = null, code = 200 } = {}) {
  return res.status(code).json({ status: 'success', message, data });
}

function error(res, { message = 'Error', data = null, code = 500 } = {}) {
  return res.status(code).json({ status: 'error', message, data });
}

module.exports = { success, error };
