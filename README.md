# 🧪 Proyecto de Automatización QA - SauceDemo

## 📝 Descripción
Este proyecto implementa la automatización del flujo de compra de la aplicación SauceDemo utilizando Playwright y TypeScript bajo el patrón de diseño Page Object Model (POM).

El objetivo es validar de manera automática el proceso completo de compra de un producto, desde el inicio de sesión hasta la confirmación exitosa de la orden.

---

## 🛠️ Tecnologías Utilizadas
* Playwright
* TypeScript
* Page Object Model (POM)
* Git
* GitHub
* GitHub Actions
* Apidog
* IA Generativa (Copilot / Apidog AI)

---

## 📌 Historia de Usuario

### HU-01 - Flujo de Compra
> **Como** usuario registrado  
> **Deseo** agregar un producto al carrito de compras  
> **Para** completar una compra exitosa.

---

## 🎯 Alcance de la Automatización
El flujo automatizado cubre:
1. Inicio de sesión.
2. Visualización del inventario.
3. Adición de producto al carrito.
4. Acceso al carrito.
5. Inicio del checkout.
6. Registro de información del cliente.
7. Confirmación de la compra.
8. Validación del mensaje de compra exitosa.

---

## 🏗️ Arquitectura
Se implementó el patrón Page Object Model (POM) para separar:
* Acciones de negocio
* Selectores
* Casos de prueba

### Estructura:
```text
tests/
│
├── checkout.spec.ts
│
└── page-objects/
    ├── base.page.ts
    ├── login.page.ts
    ├── products.page.ts
    ├── cart.page.ts
    └── checkout.page.ts
```

---

## ⚙️ Configuración de Ambientes
Las variables de entorno se almacenan fuera del código fuente utilizando archivos `.env`.

### Ejemplo:
```env
BASE_URL=https://www.saucedemo.com

STANDARD_USER=standard_user
STANDARD_PASSWORD=secret_sauce

FIRST_NAME=Adrian
LAST_NAME=Cantor
POSTAL_CODE=1010

PRODUCT_NAME=Sauce Labs Backpack
```

---

## ⭐ Buenas Prácticas Implementadas
* Variables por ambiente.
* Secrets fuera del código.
* Uso de Page Object Model.
* Selectores robustos.
* Separación de responsabilidades.
* Código reutilizable.
* Tipado fuerte con TypeScript.
* Compatibilidad Multi Browser.

---

## 🌐 Navegadores Ejecutados
La suite se ejecuta en:
* Chromium
* Firefox
* WebKit

---

## 📊 Evidencias Automatizadas

### Configuración activa:
```typescript
trace: "on-first-retry",
screenshot: "only-on-failure",
video: "retain-on-failure"
```

### Genera automáticamente:
* HTML Report
* Screenshots de fallos
* Videos de ejecución
* Trace Viewer

---

## 🏷️ Tags Implementados
Las pruebas soportan ejecución por etiquetas.

### Ejemplo:
```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@critical"
```

### Etiquetas disponibles:
* `@smoke`
* `@critical`

---

## 🚀 Ejecución Local

### Instalar dependencias:
```bash
npm install
```

### Ejecutar pruebas:
```bash
npx playwright test
```

### Abrir reporte:
```bash
npx playwright show-report
```

---

## 🔄 Integración Continua (CI/CD)
Se implementó un pipeline de GitHub Actions.

**Ubicación:**
`.github/workflows/playwright.yml`

El pipeline ejecuta automáticamente:
* Instalación de dependencias.
* Instalación de navegadores Playwright.
* Ejecución de la suite.
* Publicación de artefactos.

### Flujo CI/CD
```text
Git Push
    ↓
GitHub Actions
    ↓
Playwright
    ↓
Reporte
    ↓
Resultado
```

---

## 🤖 Uso de Inteligencia Artificial
La IA fue utilizada para:
* Análisis de la Historia de Usuario.
* Generación de casos de prueba.
* Asistencia en construcción de Page Objects.
* Refactorización de código.
* Generación de pruebas API en Apidog.

---

## 🎉 Resultado
Se logró implementar una solución de automatización que cubre:
* Automatización UI.
* Gestión de ambientes.
* Ejecución Multi Browser.
* Evidencias automáticas.
* Integración Continua.
* Soporte para pruebas API.
* Uso de Inteligencia Artificial para optimización del proceso de pruebas.