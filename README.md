<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Supermercados Cáceres - Ofertas y Catálogo

Aplicación web para mostrar ofertas de supermercados con capacidad de generar imágenes profesionales de productos usando IA.

## Características

- 🎯 **Catálogo de Ofertas** - Mostrar productos en oferta con descuentos
- 📍 **Localizador de Sucursales** - Encontrar sucursales cercanas
- 📚 **Historia de la Empresa** - Información sobre la compañía
- 🤖 **Generador de Imágenes de Producto** - Usa Google Gemini para crear imágenes profesionales de productos

## Demo: Generación de Imagen de Producto

**NUEVO:** Una nueva sección permite capturar o subir una foto de un producto y generar una versión profesional usando Google Gemini AI.

Ver [PRODUCT_IMAGE_GENERATION.md](./PRODUCT_IMAGE_GENERATION.md) para instrucciones detalladas.

## Requisitos

- Node.js 16+
- API Key de Google Generative AI (para la característica de generación de imágenes)

## Instalación y Ejecución

### 1. Instalar dependencias:
```bash
npm install
```

### 2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` y agrega tu API key de Google:
```env
GOOGLE_API_KEY=tu_api_key_aqui
```

Obtén tu API key en: https://aistudio.google.com/app/apikey

### 3. Ejecutar en desarrollo:

**Opción A - Frontend y Backend separados:**

Terminal 1 (Vite - Frontend):
```bash
npm run dev
```

Terminal 2 (Servidor Express - Backend):
```bash
npm run dev:server
```

**Opción B - Construir y ejecutar todo junto:**
```bash
npm run build
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo Vite
- `npm run dev:server` - Inicia servidor Express con hot reload
- `npm run build` - Compila la aplicación para producción
- `npm start` - Ejecuta el servidor Express (requiere build previo)
- `npm run preview` - Previsualiza la build de producción
- `npm run clean` - Elimina la carpeta dist
- `npm run lint` - Verifica tipos TypeScript

## Estructura del Proyecto

```
src/
  ├── App.tsx          - Componente principal con todas las secciones
  ├── main.tsx         - Punto de entrada
  ├── index.css        - Estilos globales con Tailwind
public/
  └── LOGO.png         - Logo de Grupo Cáceres
server.ts             - Servidor Express para API
package.json          - Dependencias y scripts
vite.config.ts        - Configuración de Vite
tsconfig.json         - Configuración de TypeScript
```

## Tecnologías Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS, Motion (Framer Motion)
- **Backend:** Express.js, TypeScript
- **IA:** Google Generative AI (Gemini 2.0 Flash)
- **Build:** Vite
- **Estilos:** Tailwind CSS 4

## Notas Importantes

- El archivo `.env` contiene tu API key y está en `.gitignore` - nunca lo subas a GitHub
- La característica de generación de imágenes requiere una API key válida
- Las imágenes se procesan a través de Google Gemini - se envían datos a Google
- Para desarrollo local, asegúrate que ambos servidores (Vite y Express) estén ejecutándose

## Solución de Problemas

Ver [PRODUCT_IMAGE_GENERATION.md](./PRODUCT_IMAGE_GENERATION.md#solución-de-problemas) para problemas con la generación de imágenes.

## Licencia

Este proyecto es propiedad de Grupo Cáceres.

---

**Última actualización:** Marzo 2026
