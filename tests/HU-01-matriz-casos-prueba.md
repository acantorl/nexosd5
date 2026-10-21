# Matriz de casos de prueba — HU-01: Flujo de Compra

**Historia de usuario:** Como usuario registrado, deseo agregar un producto al carrito de compras para finalizar una compra exitosa.

| ID | Escenario | Precondiciones | Pasos principales | Resultado esperado | Prioridad |
|---|---|---|---|---|---|
| HU01-CP-01 | Agregar un producto al carrito | Usuario registrado en SauceDemo; catálogo disponible; carrito vacío al iniciar la prueba. | Iniciar sesión y agregar `PRODUCT_NAME`. | La insignia del carrito muestra `1`. | Alta |
| HU01-CP-02 | Verificar el producto agregado en el carrito | Usuario registrado; catálogo disponible. | Iniciar sesión, agregar `PRODUCT_NAME` y abrir el carrito. | El carrito muestra el producto agregado. | Alta |
| HU01-CP-03 | Agregar más de un producto | Usuario registrado; catálogo disponible. | Iniciar sesión y agregar `PRODUCT_NAME` y Sauce Labs Bike Light. | La insignia del carrito muestra `2`. | Media |
| HU01-CP-04 | Completar una compra exitosa | Usuario registrado; datos de checkout disponibles en `.env.qa`. | Iniciar sesión, agregar `PRODUCT_NAME`, abrir carrito, completar datos, revisar la orden y finalizar la compra. | Se muestra la confirmación de que la orden fue realizada. | Alta |

Los escenarios automatizados son independientes: Playwright crea una página nueva para cada prueba y cada escenario inicia sesión desde el estado inicial.
