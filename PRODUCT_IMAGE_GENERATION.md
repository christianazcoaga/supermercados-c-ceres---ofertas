# Demo: Generación de Imagen de Producto con Gemini

Esta nueva sección permite generar imágenes profesionales de productos usando la API de Google Gemini.

## Requisitos

1. **API Key de Google Gemini**
   - Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Crea una nueva API key
   - Copia la key

2. **Configuración del Servidor**
   
   Instala las dependencias necesarias (ya está en package.json):
   ```bash
   npm install
   ```

3. **Variables de Entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```bash
   cp .env.example .env
   ```
   
   Luego edita `.env` y agrega tu API key:
   ```env
   GOOGLE_API_KEY=tu_api_key_aqui
   PORT=3000
   ```

## Cómo Usar

### Desarrollo Local

1. **Compilar y servir el frontend + backend:**
   
   En una terminal, ejecuta tres comandos en paralelo:
   
   Terminal 1 - Compilar frontend:
   ```bash
   npm run dev
   ```
   
   Terminal 2 - Ejecutar servidor backend:
   ```bash
   npm run dev:server
   ```
   
   O si quieres que ambos usen el mismo puerto:
   - Primero compila el frontend: `npm run build`
   - Luego ejecuta: `npm run start`

2. **Accede a la aplicación:**
   
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:3000/api/generate-product-image` (POST)

### Flujo de Uso

1. **Captura de Imagen:**
   - Haz clic en "Tomar Foto con Cámara" para usar tu webcam
   - O haz clic en "Subir Imagen" para seleccionar una imagen de tu dispositivo

2. **Generación:**
   - Una vez que tengas la imagen capturada, haz clic en "Generar Imagen Profesional"
   - El servidor enviará la imagen a Gemini
   - Gemini analizará el producto y generará una versión profesional

3. **Descargar:**
   - Descarga la imagen generada haciendo clic en "Descargar Imagen"
   - O genera otra imagen

## Cómo Funciona

### Flujo:

1. **Frontend (React + Vite)**
   - Captura imagen de cámara o archivo
   - Convierte a base64
   - Envía al servidor via POST a `/api/generate-product-image`

2. **Backend (Express + Gemini API)**
   - Recibe la imagen en base64
   - Llama a Gemini 2.0 Flash para analizar el producto
   - Genera un prompt descriptivo sobre cómo debería verse profesionalmente
   - Usa ese análisis para crear una imagen profesional
   - Devuelve la imagen generada

3. **Frontend**
   - Recibe la imagen generada
   - La muestra en la sección de "Imagen Profesional Generada"
   - Permite descargarla

## Modelos Utilizados

- **Análisis de Imagen:** `gemini-2.0-flash` (análisis rápido y eficiente)
- **Generación de Imagen:** Gemini (usando capacidades de generación de imágenes)

## Solución de Problemas

### Error "Cuota de API excedida" (429 Too Many Requests)

La API de Google tiene límites en la capa gratuita. Si ves este error:

**Causas:**
- Excediste el límite de llamadas diarias/por minuto de la capa gratuita
- Excediste el límite de tokens procesados

**Soluciones:**

1. **Opción 1: Esperar a que se reinicie la cuota**
   - La cuota gratuita se reinicia cada 24 horas
   - Intenta nuevamente en un par de horas o mañana

2. **Opción 2: Upgrade a Plan Pagado**
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Habilita la facturación en tu proyecto
   - Los limites aumentan significativamente con un plan pagado
   - Los primeros $5 USD de uso son gratuitos cada mes

3. **Opción 3: Usar un modelo diferente (ya implementado)**
   - El servidor ahora usa `gemini-1.5-flash` que es más eficiente
   - Puedes cambiar a otros modelos en `server.ts`
   - Modelos disponibles:
     - `gemini-1.5-flash` (rápido, eficiente)
     - `gemini-1.5-pro` (más potente, más lento)
     - `gemini-2.0-flash` (latest, si tienes cuota)

### Error "No se pudo acceder a la cámara"
- Verifica que hayas dado permisos de cámara al navegador
- En navegadores HTTPS o localhost, deberías tener permisos
- Usa "Subir Imagen" como alternativa

### Error "API Key inválida"
- Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
- Verifica que la key esté activa
- Intenta crear una nueva key
- Asegúrate de que el archivo `.env` tiene la key correcta
- Reinicia el servidor después de cambiar la key

### La generación de imagen no devuelve imagen

Actualmente, el servidor genera un análisis detallado del producto usando Gemini. La generación de imágenes reales requiere:
- Un plan pagado con acceso a modelos de generación de imágenes
- O usar servicios adicionales como Imagen API

El análisis devuelto es útil para:
- Entender cómo debería verse el producto
- Crear un prompt detallado para otras herramientas de generación
- Mejorar descripciones de productos

## Consideraciones de Seguridad

- **NUNCA** subas tu API key a GitHub
- El archivo `.env` está en `.gitignore`
- Los datos de imagen se envían a Google Gemini para procesamiento
- Las imágenes generadas se procesan y se devuelven, no se almacenan en el servidor

## Desarrollo

### Agregar Validaciones Adicionales

Puedes agregar validaciones en `server.ts`:
- Validar tamaño máximo de imagen
- Validar tipos de archivo
- Rate limiting
- Autenticación

### Personalizar Prompt

Edita el `imagePrompt` y `prompt` en `server.ts` para cambiar cómo Gemini analiza las imágenes:

```typescript
const prompt = `Tu prompt personalizado aquí...`;
const imagePrompt = `Tu prompt para imagen...`;
```

### Cambiar Modelo de IA

En `server.ts`, busca la línea que dice:
```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
```

Y cámbialo a:
```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
```

O cualquier otro modelo disponible en la API de Google.

## Modelos Disponibles y Cuotas

| Modelo | Cuota Diaria | Límite/Minuto | Recomendación |
|--------|-------------|---------------|--------------|
| gemini-1.5-flash | Muy alto | 15 peticiones | ✅ Recomendado para desarrollo |
| gemini-1.5-pro | Alto | 2 peticiones | Análisis complejos |
| gemini-2.0-flash | Limitado (gratuito) | Muy bajo | Cuando hay cuota disponible |

## Créditos

- **Frontend:** React con Tailwind CSS y Motion (Framer Motion)
- **Backend:** Express.js
- **IA:** Google Generative AI
- **Modelos:** gemini-1.5-flash (predeterminado)
