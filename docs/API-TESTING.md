# Pruebas API de soporte para HU-01

## 1. Propósito y alcance

Esta suite complementa la automatización UI de HU-01 con pruebas del catálogo y del carrito mediante [DummyJSON](https://dummyjson.com).

La prueba UI de SauceDemo está en `tests/purchase-flow.spec.ts`; las pruebas API están en `tests/api/purchase-flow.api.spec.ts`. **DummyJSON no es el backend de SauceDemo**. Son aplicaciones independientes: las pruebas API no comprueban integración, sincronización de inventario ni persistencia de compras en SauceDemo. DummyJSON simula la operación de añadir al carrito para practicar y validar el contrato REST.

## 2. Casos y resultados

| ID | Caso | Método y endpoint | Resultado informado en Apidog |
|---|---|---|---|
| HU01-API-01 | Consultar y mapear un producto | `GET /products/1` | `200 OK` |
| HU01-API-02 | Agregar un producto al carrito | `POST /carts/add` | `201 Created` |

La última ejecución automatizada registrada para la suite completa del proyecto reportó **6 pruebas aprobadas**, incluidas las dos pruebas API y las cuatro pruebas UI. El reporte automático reconoció la salida de Playwright como exitosa, aunque su parser de conteos no identificó el framework (`testFramework: unknown`, `parseFailed: true`).

> **Aclaración de endpoint:** el resultado `201` corresponde a `POST https://dummyjson.com/carts/add`. `GET /products/1` es la consulta del producto y su resultado informado es `200`.

## 3. HU01-API-01 — Consultar y mapear un producto

### Request

```http
GET https://dummyjson.com/products/1
```

### Respuesta observada en Apidog

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

Campos relevantes usados por el modelo de la automatización:

```json
{
  "id": 1,
  "title": "Essence Mascara Lash Princess",
  "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
  "category": "beauty",
  "price": 9.99,
  "stock": 99,
  "thumbnail": "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"
}
```

La API también devuelve campos adicionales, como `discountPercentage`, `rating`, `tags`, `brand`, `sku`, `dimensions`, `reviews`, `images` y `meta`. El modelo de esta prueba selecciona los campos necesarios para identificar y mostrar el producto; los campos adicionales no forman parte de `CatalogProduct`.

### Validaciones automatizadas

- La respuesta contiene un producto con `id` igual a `1`.
- Título, descripción, categoría, precio, inventario e imagen tienen tipos válidos.
- El precio y el inventario son mayores que cero.
- La URL de miniatura utiliza HTTPS.

## 4. HU01-API-02 — Agregar producto al carrito

### Request

```http
POST https://dummyjson.com/carts/add
Content-Type: application/json
```

```json
{
  "userId": 1,
  "products": [
    {
      "id": 1,
      "quantity": 1
    }
  ]
}
```

### Respuesta observada en Apidog

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "id": 209,
  "products": [
    {
      "id": 1,
      "title": "Essence Mascara Lash Princess",
      "price": 9.99,
      "quantity": 1,
      "total": 9.99,
      "discountPercentage": 10.48,
      "discountedPrice": 9,
      "thumbnail": "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"
    }
  ],
  "total": 9.99,
  "discountedTotal": 9,
  "userId": 1,
  "totalProducts": 1,
  "totalQuantity": 1
}
```

### Validaciones automatizadas

- El carrito devuelto tiene un identificador positivo y `userId` igual a `1`.
- Incluye un producto y una unidad.
- El producto corresponde al obtenido en HU01-API-01: id, título y precio.
- El total del producto corresponde al precio multiplicado por la cantidad.
- El total con descuento es positivo.

## 5. Modelos y mapeo

El cliente [dummyjson-api.client.ts](../api/dummyjson-api.client.ts) centraliza las solicitudes y transforma las respuestas externas a los modelos de [dummyjson.models.ts](../api/dummyjson.models.ts):

| Modelo | Mapeo |
|---|---|
| `CatalogProduct` | `id`, `title`, `description`, `category`, `price`, `stock`, `thumbnail` |
| `AddToCartRequest` | `userId` y `products[]` con `id` y `quantity` |
| `ShoppingCart` | `id`, `userId`, `total`, `discountedTotal`, `totalProducts`, `totalQuantity` y `products[]` |
| Producto del carrito | `id`, `title`, `price`, `quantity`, `total`, `discountedPrice`, `thumbnail` |

Los datos de respuesta se consideran `unknown` hasta verificar los campos y sus tipos. Las respuestas HTTP no exitosas generan un error con el código y contenido recibido; las respuestas exitosas con forma incompatible también producen un error descriptivo.

## 6. Estado de las aserciones de status HTTP

Apidog registra explícitamente `200` para el `GET` y `201` para el `POST` en los resultados proporcionados.

En la automatización Playwright actual, `DummyJsonApiClient` comprueba `response.ok()`, lo que acepta cualquier status HTTP exitoso, y las pruebas verifican el mapeo y contenido del payload. **Las pruebas actuales no contienen aserciones estrictas `toBe(200)` o `toBe(201)`**; por ello, los códigos anteriores se documentan como resultados observados en Apidog, no como status codes verificados explícitamente por las aserciones Playwright.

## 7. Configuración

- URL base por defecto: `https://dummyjson.com`.
- Variable opcional para sobrescribirla: `DUMMYJSON_BASE_URL`.
- Las pruebas API no requieren credenciales de SauceDemo.
- La solicitud usa el fixture `request` de Playwright y no comparte estado de navegador con las pruebas UI.

## 8. Ejecución

```bash
npx playwright test tests/api/purchase-flow.api.spec.ts --project=chromium
```

## 9. Límites conocidos

- DummyJSON es un servicio público externo; disponibilidad o cambios de datos/contrato pueden afectar la suite.
- La creación del carrito es simulada y no debe interpretarse como persistencia comercial.
- Estos casos API no realizan una compra ni se conectan con SauceDemo.
- Para comprobar status exactos como parte de la suite automatizada, se tendrían que exponer los status desde el cliente o validarlos directamente en las pruebas.
