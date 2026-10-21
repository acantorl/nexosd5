# Reporte del proyecto de automatización QA

## 1. Resumen

Este proyecto automatiza la historia de usuario **HU-01: Flujo de Compra** con Playwright y TypeScript. La suite de interfaz valida el proceso de compra en SauceDemo. Una suite API separada valida el catálogo y la creación simulada de un carrito en DummyJSON.

**Importante:** DummyJSON no es el backend de SauceDemo. Las pruebas UI y API cubren sistemas independientes; la suite API ofrece validación complementaria de contratos de productos y carrito, pero no comprueba una integración entre ambas aplicaciones.

## 2. Historia de usuario y alcance

> **Como** usuario registrado  
> **Deseo** poder agregar un producto al carrito de compras  
> **Para** finalizar una compra exitosa.

### Interfaz — SauceDemo

La especificación [purchase-flow.spec.ts](../tests/purchase-flow.spec.ts) cubre cuatro casos:

| ID | Caso | Resultado esperado |
|---|---|---|
| HU01-CP-01 | Agregar un producto | La insignia del carrito muestra una unidad. |
| HU01-CP-02 | Verificar el producto en el carrito | El carrito muestra el producto seleccionado. |
| HU01-CP-03 | Agregar varios productos | La insignia del carrito muestra dos unidades. |
| HU01-CP-04 | Completar una compra | Se muestra la confirmación de compra exitosa. |

La matriz detallada se encuentra en [HU-01-matriz-casos-prueba.md](../tests/HU-01-matriz-casos-prueba.md).

### API — DummyJSON

La especificación [purchase-flow.api.spec.ts](../tests/api/purchase-flow.api.spec.ts) cubre dos casos:

| ID | Caso | Endpoint(s) | Resultado esperado |
|---|---|---|---|
| HU01-API-01 | Consultar y mapear un producto | `GET /products/{id}` | El payload se transforma a un modelo tipado y cumple las validaciones de campos. |
| HU01-API-02 | Solicitar la creación de un carrito | `GET /products/{id}`, `POST /carts/add` | La respuesta se mapea a carrito y contiene el producto y cantidad solicitados. |

DummyJSON simula la creación del carrito; no representa persistencia real ni una compra en SauceDemo. El detalle de endpoints y modelos se documenta en [API-TESTING.md](./API-TESTING.md).

## 3. Arquitectura

La solución separa las pruebas de interfaz, las páginas POM, las pruebas API y el cliente/modelos que mapean los contratos de DummyJSON:

```text
nexosd5/
├── api/
│   ├── dummyjson-api.client.ts
│   └── dummyjson.models.ts
├── pages/
│   ├── base.page.ts
│   ├── cart.page.ts
│   ├── checkout.page.ts
│   ├── login.page.ts
│   └── products.page.ts
├── tests/
│   ├── HU-01-matriz-casos-prueba.md
│   ├── purchase-flow.spec.ts
│   └── api/
│       └── purchase-flow.api.spec.ts
├── docs/
│   ├── API-TESTING.md
│   └── AI-REPORT.md
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── .github/workflows/playwright.yml
```

### Componentes principales

- **`pages/`**: Page Objects de SauceDemo. `BasePage` comparte el contexto `Page` y navegación; páginas especializadas representan login, productos, carrito y checkout.
- **`tests/purchase-flow.spec.ts`**: casos de interfaz organizados alrededor de HU-01 y reutilización de Page Objects.
- **`api/dummyjson-api.client.ts`**: concentra solicitudes a DummyJSON, verifica respuestas HTTP y mapea las respuestas JSON.
- **`api/dummyjson.models.ts`**: interfaces de producto, solicitud de carrito y carrito.
- **`tests/api/purchase-flow.api.spec.ts`**: aserciones del contrato API de producto y carrito.
- **`playwright.config.ts`**: configuración del runner, entornos, proyectos de navegador y artefactos de diagnóstico.
- **`tsconfig.json`**: configuración TypeScript estricta.
- **`.github/workflows/playwright.yml`**: instalación y ejecución automática de la suite en GitHub Actions.

## 4. Contratos y mapeo API

`DummyJsonApiClient` usa `https://dummyjson.com` de forma predeterminada. La URL base se puede sustituir con `DUMMYJSON_BASE_URL`.

| Modelo | Campos seleccionados |
|---|---|
| `CatalogProduct` | `id`, `title`, `description`, `category`, `price`, `stock`, `thumbnail` |
| `AddToCartRequest` | `userId` y lista de productos con `id` y `quantity` |
| `ShoppingCart` | identificador, usuario, totales, cantidades y lista de productos |

Las respuestas se reciben inicialmente como datos no confiables (`unknown`). El cliente valida tipos y campos requeridos antes de mapearlos. Si la respuesta HTTP no es exitosa o la forma del payload no coincide con el contrato esperado, se lanza un error descriptivo; no se fabrican valores por defecto.

## 5. Datos de prueba y configuración

La configuración de Playwright carga `.env.qa`. Las pruebas UI usan:

| Variable | Uso |
|---|---|
| `BASE_URL` | URL de SauceDemo; si no se define, usa `https://www.saucedemo.com`. |
| `STANDARD_USER` | Usuario de SauceDemo. |
| `STANDARD_PASSWORD` | Contraseña de SauceDemo. |
| `PRODUCT_NAME` | Producto principal de la prueba de compra. |
| `FIRST_NAME`, `LAST_NAME`, `POSTAL_CODE` | Datos para checkout. |

La suite API usa datos de prueba estáticos para el producto y usuario de DummyJSON; no requiere las credenciales de SauceDemo. No se debe publicar el archivo de entorno si contiene credenciales reales.

## 6. Herramientas y dependencias

- Playwright Test: pruebas UI y API.
- TypeScript: tipado y compilación/verificación estática.
- dotenv: carga de variables desde `.env.qa`.
- GitHub Actions: ejecución en CI.
- `typedoc` está declarado en dependencias de desarrollo; el proyecto no configura actualmente una tarea de generación de documentación TypeDoc.

## 7. Configuración de ejecución

`playwright.config.ts`:

- Define `tests/` como directorio de pruebas.
- Usa `BASE_URL` o `https://www.saucedemo.com` como URL base.
- Configura `data-test` como atributo de test id.
- Habilita ejecución paralela; limita los workers a uno en CI.
- Configura dos reintentos en CI.
- Usa el reporter HTML.
- Configura traza `on`, captura de screenshot ante fallo y video `retain-on-failure`.
- Declara proyectos para Chromium, Firefox y WebKit.

Que los tres proyectos estén configurados significa que Playwright puede ejecutarlos; el último resultado documentado en este reporte corresponde a Chromium y no certifica ejecuciones recientes en Firefox o WebKit.

## 8. Resultados de validación

Última validación registrada: **21 de octubre de 2026**, mediante el plan de validación en modo independiente.

| Verificación | Resultado |
|---|---|
| TypeScript (`tsc --noEmit --ignoreDeprecations 6.0`) | Aprobada, salida 0. |
| Pruebas UI HU-01 en Chromium | 4 casos aprobados. |
| Pruebas API DummyJSON en Chromium | 2 casos aprobados. |
| Total de pruebas automatizadas en esa ejecución | 6 aprobadas, 0 fallidas. |

El ejecutor de validación marcó correctamente en verde el proceso de Playwright, aunque su parser no pudo reconocer el formato de conteos y almacenó `testFramework: unknown` y `parseFailed: true`. El log de Playwright sí reportó explícitamente `6 passed`. Esta nota distingue el resultado de las pruebas del límite del parser de métricas.

El resultado detallado del ejecutor, si se conserva localmente, se escribe en `.tsupgrader/runtime-validation/standalone-result.json`; ese artefacto puede cambiar o no formar parte del repositorio.

## 9. Integración continua

El workflow [playwright.yml](../.github/workflows/playwright.yml) se ejecuta en `push` y `pull_request` contra `main` y `master`. Sus pasos incluyen:

1. Checkout del repositorio.
2. Configuración de Node.js LTS.
3. Instalación con `npm ci`.
4. Instalación de navegadores con `npx playwright install --with-deps`.
5. Ejecución de `npx playwright test`.
6. Carga del directorio `playwright-report/` como artefacto.

Las pruebas UI dependen de variables en `.env.qa`. En CI, las variables necesarias deben configurarse mediante secretos/variables del entorno y cargarse de forma segura; no se debe incluir el archivo con credenciales en el repositorio.

## 10. Ejecución local

Instalación y ejecución de toda la suite:

```bash
npm ci
npx playwright install
npx playwright test
```

Ejecutar solo las pruebas UI de la historia:

```bash
npx playwright test tests/purchase-flow.spec.ts --project=chromium
```

Ejecutar solo las pruebas API:

```bash
npx playwright test tests/api/purchase-flow.api.spec.ts --project=chromium
```

Abrir el reporte HTML:

```bash
npx playwright show-report
```

## 11. Buenas prácticas y límites

- Page Object Model para separar interacciones de UI y escenarios.
- Modelos API explícitos y tipados.
- Validación en runtime de respuestas JSON externas.
- Reutilización del cliente HTTP para evitar duplicar rutas y mapeo.
- Casos independientes y etiquetados con identificadores ligados a HU-01.
- Credenciales de SauceDemo externalizadas en variables de entorno.
- Aserciones sobre resultados observables (contenido, cantidades y confirmación).
- Distinción explícita entre pruebas UI y API para evitar afirmar integración inexistente.
- La suite API depende de la disponibilidad externa de DummyJSON; una indisponibilidad de ese servicio puede bloquear esas pruebas.

## 12. Uso de IA

La asistencia de IA se utilizó para apoyar el análisis de HU-01, la estructuración de casos de prueba, la organización POM y el refactor del cliente/modelos y las pruebas API. Los contratos, selectores y resultados descritos en este reporte corresponden a los archivos y ejecuciones del proyecto; la IA no sustituye la revisión de requisitos ni las validaciones.
