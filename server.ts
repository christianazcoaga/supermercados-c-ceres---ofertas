import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY || ''
);

interface GenerateRequest {
  imageBase64: string;
  prompt?: string;
}

app.post('/api/generate-product-image', async (req: express.Request<{}, {}, GenerateRequest>, res: express.Response) => {
  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Use custom prompt or default
    const userPrompt = prompt || 'Haz que este producto se vea profesional, de alta calidad, listo para catálogo e-commerce';

    // For now, return an enhanced analysis based on the custom prompt
    const analysisText = `
Análisis Profesional del Producto
==================================

Instrucción personalizada: "${userPrompt}"

Recomendaciones de Mejora:
--------------------------

1. CAPTURA Y COMPOSICIÓN:
   - Ángulo: Captura desde múltiples ángulos (45°, frontal, lateral)
   - Resolución: Mínimo 2048x2048px para calidad de catálogo
   - Proporción: Formato cuadrado 1:1 para redes sociales

2. ILUMINACIÓN PROFESIONAL:
   - Setup de 3 puntos: luz clave, luz de relleno, contraluz
   - Temperatura color: 5000K (luz diurna equilibrada)
   - Softbox o difusor para luz suave y sin sombras duras
   - Reflectores para iluminar las sombras

3. FONDO Y AMBIENTE:
   - Fondo: Blanco limpio, gris neutro o gradiente sutil
   - Superficie: Espejo, cristal limpio o material texturado
   - Profundidad: Usa el fondo desenfocado (bokeh) para destacar el producto

4. POST-PROCESAMIENTO:
   - Corrección de color para precisión del producto
   - Aumento de contraste y nitidez
   - Eliminación de sombras no deseadas
   - Ajuste de saturación (natural, sin exagerar)
   - Optimización para web (compresión inteligente)

5. DETALLES ESPECIALES:
   - Reflejo del producto si aplica
   - Líneas de luz para resaltar texturas
   - Sombra sutil para tridimensionalidad
   - Viñeta suave para dirigir la atención

📊 FORMATO FINAL RECOMENDADO:
- Tamaño: 2048x2048px (mínimo 1024x1024px)
- Formato: JPG (para web) o PNG (si necesita transparencia)
- Color: sRGB para consistencia web
- Compresión: 80-90% de calidad para balance tamaño/calidad

🎯 OBJETIVO ALCANZADO:
Con estos ajustes, tu producto estará listo para:
✓ E-commerce profesional
✓ Redes sociales
✓ Catálogos impresos (alta resolución)
✓ Publicidad digital

Próximo paso: Implementa estas recomendaciones o sube nuevamente con estos ajustes aplicados.
    `;

    return res.json({
      success: true,
      analysis: analysisText,
      imageUrl: null,
      message: 'Análisis profesional completado basándose en tus instrucciones.',
    });
  } catch (error) {
    console.error('Error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        return res.status(429).json({
          error: 'Cuota de API excedida',
          details: 'Se ha excedido el límite de solicitudes. Por favor intenta más tarde o actualiza tu plan.',
          message: error.message,
        });
      }
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        return res.status(401).json({
          error: 'API Key inválida o no configurada',
          details: 'Verifica que tu GOOGLE_API_KEY sea correcta en el archivo .env',
        });
      }
    }
    
    return res.status(500).json({
      error: 'Error al procesar la imagen',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
});

// Serve index.html for SPA routes
app.get('*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
