import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

interface GenerateRequest {
  imageBase64: string;
  prompt?: string;
}

app.post('/api/generate-product-image', async (req: express.Request<{}, {}, GenerateRequest>, res: express.Response) => {
  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    const userPrompt = prompt || 'Genera una imagen profesional de catálogo de este producto. Fondo blanco de estudio, iluminación perfecta, sin distracciones, alta resolución.';
    console.log(`Pidiendo imagen a Photoroom API... Prompt: "${userPrompt}"`);

    // Remove base64 prefix
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Create form-data
    const formData = new FormData();
    formData.append('imageFile', imageBuffer, { filename: 'product.jpg', contentType: 'image/jpeg' });
    
    // Forzar fondo 100% blanco estándar en lugar de un prompt inventado por la IA
    formData.append('background.color', '#FFFFFF');
    
    // (Opcional) Podemos agregar una sombra IA suave para que el producto no parezca "flotando" y quede más profesional
    // formData.append('shadow.mode', 'ai.soft'); 
    
    // Un poco de margen/padding del 10% alrededor para que el producto no toque los bordes
    formData.append('padding', '0.1');

    const photoroomKey = process.env.PHOTOROOM_API_KEY;

    if (!photoroomKey) {
      throw new Error("PHOTOROOM_API_KEY no está configurada en el archivo .env");
    }

    // Call Photoroom v2 API
    const response = await fetch('https://image-api.photoroom.com/v2/edit', { // Using Photoroom API endpoint
      method: 'POST',
      headers: {
        'x-api-key': photoroomKey,
      },
      body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Photoroom Error:", errorText);
        throw new Error(`Error de Photoroom: ${response.status} - ${errorText}`);
    }

    // Photoroom usually returns the raw image buffer instead of a JSON.
    const imageResultBuffer = await response.arrayBuffer();
    const finalImageUrl = `data:image/jpeg;base64,${Buffer.from(imageResultBuffer).toString('base64')}`;

    res.json({
      success: true,
      analysis: null,
      imageUrl: finalImageUrl,
      message: '¡Imagen generada exitosamente por Photoroom!',
    });
    return;
  } catch (error) {
    console.error('Error Photoroom:', error);
    
    // Fallback error handling
    res.status(500).json({
      error: 'Error interno del servidor al procesar la imagen.',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
    return;
  }
});

// Serve index.html for SPA routes
app.get('*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
