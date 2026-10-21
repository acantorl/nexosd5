# 🌐 API Testing con Apidog

## 🎯 Objetivo
Complementar la automatización UI desarrollada en Playwright mediante pruebas API utilizando Apidog y una API pública de pruebas.

La automatización UI fue implementada sobre SauceDemo, mientras que la automatización API se realizó utilizando DummyJSON para demostrar validación de servicios REST, respuestas HTTP y generación de casos de prueba mediante Inteligencia Artificial.

---

## 🛠️ Herramientas Utilizadas
* Apidog
* DummyJSON
* Playwright
* GitHub
* GitHub Actions
* Inteligencia Artificial de Apidog

---

## 💡 Justificación de la API Utilizada

Durante la automatización de SauceDemo se realizó una inspección del tráfico de red utilizando Playwright con el objetivo de identificar los endpoints consumidos por la aplicación.

Se analizaron los flujos de:
* Inicio de sesión
* Visualización de inventario
* Adición de productos al carrito
* Proceso de checkout
* Confirmación de compra

Sin embargo, el análisis evidenció principalmente recursos estáticos como:
* HTML
* CSS
* JavaScript
* Imágenes
* Fuentes

sin exponer de forma clara endpoints REST de negocio reutilizables para pruebas API independientes.

Por esta razón se decidió utilizar la API pública:
https://dummyjson.com

La API DummyJSON fue seleccionada porque proporciona endpoints diseñados específicamente para prácticas de automatización y pruebas de calidad, permitiendo validar autenticación, respuestas JSON, códigos HTTP y escenarios positivos y negativos.

---

## ⚙️ Ambiente Configurado

### QA

Variables configuradas en Apidog:

| Variable | Valor |
| :--- | :--- |
| `baseUrl` | `https://dummyjson.com` |
| `username` | `emilys` |
| `password` | `emilyspass` |

---

## 📁 Colección Utilizada

Las pruebas API fueron almacenadas y exportadas desde Apidog mediante la colección:
`nexosd5.apidog.json`

La colección contiene los escenarios desarrollados para validar el proceso de autenticación.

---

## 🔍 Endpoint Evaluated

### Login
* **Método:** `POST`
* **URL:** `{{baseUrl}}/auth/login`

---

## 🧪 Casos de Prueba

### Caso de Prueba 01: Login válido

* **Descripción:** Validar que un usuario registrado pueda autenticarse exitosamente.

* **Request:**
```json
{
  "username": "emilys",
  "password": "emilyspass"
}
```

* **Resultado Esperado:**
  `HTTP 200 OK`

* **Validaciones:**
  * Código HTTP 200.
  * Generación de accessToken.
  * Generación de refreshToken.
  * Retorno de información del usuario.
  * Respuesta en formato JSON.

* **Resultado Obtenido:**
  Caso ejecutado exitosamente.

---

### Caso de Prueba 02: Login inválido

* **Descripción:** Validar el comportamiento del servicio cuando se envían credenciales incorrectas.

* **Request:**
```json
{
  "username": "usuario_invalido",
  "password": "123456"
}
```

* **Resultado Esperado:**
  `HTTP 400`  
  *Credenciales inválidas*

* **Validaciones:**
  * Código HTTP 400.
  * Respuesta JSON informando error.
  * Rechazo de autenticación.

* **Resultado Obtenido:**
  Caso ejecutado exitosamente.

---

## 🤖 Generación de Casos con Inteligencia Artificial

Se utilizó la funcionalidad de Inteligencia Artificial integrada en Apidog para generar escenarios adicionales sobre el endpoint de autenticación.

La IA propuso escenarios relacionados con:
* Credenciales válidas.
* Credenciales inválidas.
* Usuario vacío.
* Contraseña vacía.
* Campos obligatorios.
* Validación de respuestas HTTP.
* Manejo de errores.

Estos casos fueron utilizados como apoyo para fortalecer el análisis funcional y ampliar la cobertura de pruebas.

---

## 📸 Evidencias Generadas

Durante la ejecución se obtuvieron evidencias de:
* Configuración del entorno QA.
* Ejecución de Login válido.
* Ejecución de Login inválido.
* Respuesta JSON exitosa.
* Casos de prueba generados mediante IA.
* Exportación de la colección.

### Ubicación sugerida:
```text
docs/
│
├── API-TESTING.md
├── AI-REPORT.md
│
├── apidog/
│   └── nexosd5.apidog.json
│
└── evidencias/
    ├── apidog-environment.png
    ├── login-valido.png
    ├── login-invalido.png
    └── casos-generados-ia.png
```

---

## 📊 Distribución de la Solución

### Automatización UI
* **Aplicación:** https://www.saucedemo.com
* **Herramienta:** Playwright
* **Cobertura:**
  * Login.
  * Inventario.
  * Carrito de compras.
  * Checkout.
  * Compra exitosa.

### Automatización API
* **API:** https://dummyjson.com/auth/login
* **Herramienta:** Apidog
* **Colección:** `nexosd5.apidog.json`
* **Cobertura:**
  * Login válido.
  * Login inválido.
  * Validación HTTP 200.
  * Validación HTTP 400.
  * Validación de respuestas JSON.
  * Generación de casos mediante Inteligencia Artificial.

---

## 📝 Conclusión

La automatización API permitió validar el proceso de autenticación mediante servicios REST utilizando Apidog y DummyJSON. Aunque SauceDemo fue utilizado para la automatización funcional de interfaz de usuario, DummyJSON proporcionó un entorno adecuado para demostrar conceptos de pruebas API, validación de respuestas HTTP y generación asistida de casos de prueba.

La combinación de Playwright para pruebas UI, Apidog para pruebas API y GitHub Actions para CI/CD permitió construir una solución integral de automatización y aseguramiento de calidad.