# Node & Express Web App — Proyecto Integrador (Módulos 6, 7 y 8)

Aplicación web backend construida con **Node.js**, **Express**, **Sequelize (PostgreSQL)** y **JWT**.
Proyecto de evaluación de Alkemy que integra, de forma progresiva, los tres módulos:

- **Módulo 6** — servidor Express, rutas, vistas dinámicas (EJS) y persistencia en archivos planos (logs).
- **Módulo 7** — conexión a PostgreSQL, modelos y relaciones con ORM (1:1, 1:N, N:M), CRUD, transacciones.
- **Módulo 8** — API RESTful, autenticación JWT, subida de archivos con Multer y respuestas consistentes.

---

## 🧱 Stack y arquitectura

```
src/
├── app.js                 # Configuración de Express (middlewares, rutas, estáticos)
├── server.js              # Arranque: conecta DB, sincroniza modelos y escucha
├── config/
│   ├── database.js        # Instancia de Sequelize (conexión PostgreSQL)
│   └── initDb.js          # Crea la base de datos si no existe (cliente pg)
├── models/                # Modelos + asociaciones (User, Profile, Order, Product, OrderProduct)
├── controllers/           # Lógica de cada recurso (auth, user, product)
├── routes/                # Definición de rutas (auth, user, product, web) + índice /api
├── middlewares/           # JWT, subida de archivos (multer), manejo de errores
├── services/              # Acceso a datos vía ORM + logs en archivo plano
├── utils/                 # Helper de respuestas { status, message, data }
├── seeders/               # Datos de prueba
└── views/                 # Vistas EJS (contenido dinámico módulo 6)
public/                    # Estáticos (CSS)
uploads/                   # Imágenes subidas (multer)
logs/                      # Persistencia en archivos planos
```

**Arquitectura modular:** rutas → controladores → servicios → modelos. Los controladores no acceden a la DB directamente; delegan en la capa de servicios.

---

## ✅ Requisitos previos

- Node.js **v18 o superior** (probado en v22).
- **PostgreSQL** instalado y corriendo (por defecto en `localhost:5432`).

---

## ⚙️ Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
#   -> Editar .env con tus credenciales de PostgreSQL (DB_USER, DB_PASSWORD)

# 3. Crear la base de datos (si no existe)
npm run initdb

# 4. Cargar datos de prueba (usuarios, productos, pedidos con relaciones)
npm run seed

# 5. Arrancar el servidor
npm run dev      # con nodemon (recarga automática)
# o
npm start        # producción
```

Servidor en `http://localhost:3000`.

### Variables de entorno (`.env`)

| Clave | Descripción | Ejemplo |
|-------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` `DB_PORT` `DB_NAME` `DB_USER` `DB_PASSWORD` | Conexión PostgreSQL | `localhost` / `5432` / `alkemy_backend` / `postgres` / `...` |
| `JWT_SECRET` | Secreto para firmar tokens | *(cadena larga y aleatoria)* |
| `JWT_EXPIRES_IN` | Expiración del token | `1h` |

> Las credenciales nunca van en el código: se leen de `.env`, que está en `.gitignore`.

---

## 🗄️ Modelos y relaciones (Módulo 7)

| Relación | Modelos | Descripción |
|----------|---------|-------------|
| **1:1** | `User` ↔ `Profile` | Un usuario tiene un perfil |
| **1:N** | `User` → `Order` | Un usuario tiene muchos pedidos |
| **N:M** | `Order` ↔ `Product` | Un pedido tiene muchos productos y viceversa (tabla intermedia `pedido_productos` con `cantidad`) |

- **CRUD completo** sobre dos entidades clave: **Usuarios** y **Productos**.
- **Consultas filtradas** por query params: `?nombre=`, `?email=`, `?page=`, `?limit=`.
- **Transacción con rollback** en el registro (`createWithProfile`): crea usuario + perfil de forma atómica; si falla, revierte y registra el error en `logs/transactions.log`.
- **Relaciones con `include`**: `GET /api/usuarios/:id/pedidos` trae usuario + perfil + pedidos + productos en una sola consulta.

---

## 🔐 Autenticación (JWT — Módulo 8)

1. Registrarse: `POST /api/auth/register`.
2. Login: `POST /api/auth/login` → devuelve un **token JWT**.
3. Enviar el token en las rutas protegidas mediante el header:

```
Authorization: Bearer <token>
```

El token se verifica en `middlewares/auth.middleware.js` (valida firma y expiración). Se recomienda almacenarlo en el cliente en `localStorage` o una cookie `httpOnly`.

---

## 📤 Subida de archivos (Multer — Módulo 8)

- Endpoint: `POST /api/usuarios/:id/avatar` (protegido, campo `avatar`, `multipart/form-data`).
- **Validaciones:** solo imágenes (`jpeg`, `png`, `webp`, `gif`) y máximo **2 MB**.
- El archivo se guarda en `/uploads` y su ruta se **asocia al usuario** en la base de datos (campo `avatar`).
- Accesible públicamente en `http://localhost:3000/uploads/<archivo>`.

---

## 🌐 Endpoints de la API

Formato de respuesta uniforme: `{ status, message, data }`.

### Autenticación
| Método | Ruta | Protegida | Descripción |
|--------|------|-----------|-------------|
| POST | `/api/auth/register` | No | Registro (usuario + perfil, transacción) |
| POST | `/api/auth/login` | No | Login, devuelve JWT |
| GET | `/api/auth/me` | Sí | Datos del usuario autenticado |

### Usuarios (todas protegidas)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Listado con filtros y paginación |
| GET | `/api/usuarios/:id` | Un usuario |
| GET | `/api/usuarios/:id/pedidos` | Usuario + perfil + pedidos + productos |
| PUT | `/api/usuarios/:id` | Actualización parcial |
| DELETE | `/api/usuarios/:id` | Eliminar (valida existencia) |
| POST | `/api/usuarios/:id/avatar` | Subir avatar |

### Productos
| Método | Ruta | Protegida | Descripción |
|--------|------|-----------|-------------|
| GET | `/api/productos` | No | Catálogo con filtros |
| GET | `/api/productos/:id` | No | Un producto |
| POST | `/api/productos` | Sí | Crear |
| PUT | `/api/productos/:id` | Sí | Actualizar |
| DELETE | `/api/productos/:id` | Sí | Eliminar |

### Web (vistas EJS — Módulo 6)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Home dinámico |
| GET | `/usuarios-web` | Tabla HTML de usuarios |
| GET | `/api/health` | Estado de la API |

---

## 🧪 Prueba rápida (Postman / curl)

```bash
# Login (con datos del seed)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@mail.com","password":"123456"}'

# Usar el token devuelto
curl http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <TOKEN>"

# Crear producto (protegido)
curl -X POST http://localhost:3000/api/productos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Webcam","precio":39.9,"stock":15}'
```

Usuarios del seed: `ana@mail.com`, `luis@mail.com`, `admin@mail.com` — contraseña `123456`.

---

## 🗒️ Decisiones técnicas

- **PostgreSQL + Sequelize:** base relacional que modela naturalmente las relaciones 1:1, 1:N y N:M pedidas. Sequelize aporta validaciones, asociaciones (`include`) y transacciones sin escribir SQL manual.
- **Cliente `pg`:** usado en `initDb.js` para crear la base de datos, ya que el ORM requiere que la DB exista de antemano.
- **Capa de servicios:** separa el acceso a datos de los controladores → código testeable y reutilizable.
- **Actualización parcial:** en `PUT` solo se modifican campos permitidos (whitelist), evitando sobrescribir campos sensibles como `password`.
- **bcrypt:** las contraseñas se guardan hasheadas y nunca se devuelven en las respuestas.
- **Persistencia en archivos planos:** logs de requests y de transacciones fallidas (`logs/`), cumpliendo el requisito del módulo 6.

---

## 📄 Licencia

MIT — Javier Mariscal.
