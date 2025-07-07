# Backend API de Productos

API RESTful para gestionar productos con autenticación JWT. Construida con Node.js, Express y Firebase como base de datos.

## Requisitos

- Node.js v18+
- Firebase configurado
- Archivo `.env` con la variable:

JWT_SECRET=miClaveSuperSecreta1234

## Instalación

1. Cloná el repositorio  
2. Ejecutá:

npm install
npm start

## Autenticación

### POST `/auth/login`

**Body (JSON):**
{
  "username": "admin",
  "password": "1234"
}

**Respuesta:**
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Usá ese token para acceder a las rutas protegidas. Se envía como header:

Authorization: Bearer TU_TOKEN_AQUÍ

## Endpoints de Productos (`/api/products`)

### GET `/api/products`
- Lista todos los productos.

### GET `/api/products/:id`
- Trae un producto por su ID.

### POST `/api/products` *(protegido)*

**Body (JSON):**
{
  "title": "Nombre del producto",
  "price": 999,
  "category": "categoría",
  "description": "descripción"
}

### PUT `/api/products/:id` *(protegido)*
- Actualiza los campos de un producto existente.

### DELETE `/api/products/:id` *(protegido)*
- Elimina un producto por ID.

## Validaciones

- El `title`, `description` y `category` deben ser strings no vacíos.
- El `price` debe ser un número positivo.
- Se rechazan los datos mal formados.

## Manejo de errores

- `401`: Token faltante o inválido  
- `403`: Token expirado  
- `404`: Ruta o producto no encontrado  
- `400`: Datos mal enviados  

## Tests recomendados

Podés probar los endpoints con:

- [Postman](https://www.postman.com/)
- `curl` desde consola

### Ejemplos con `curl`

# Login
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"admin","password":"1234"}'

# Obtener productos
curl -X GET http://localhost:3000/api/products

# Crear producto (con token)
curl -X POST http://localhost:3000/api/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TU_TOKEN" \
-d '{"title":"Ejemplo","price":100,"category":"Test","description":"Producto test"}'

# Actualizar producto
curl -X PUT http://localhost:3000/api/products/ID_DEL_PRODUCTO \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TU_TOKEN" \
-d '{"title":"Nuevo título","price":1500,"category":"nueva","description":"Actualizado"}'

# Eliminar producto
curl -X DELETE http://localhost:3000/api/products/ID_DEL_PRODUCTO \
-H "Authorization: Bearer TU_TOKEN"