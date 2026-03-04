import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Modelos disponibles que contienen 'image' o 'imagen':", 
      data.models?.filter((m: any) => m.name.toLowerCase().includes('image') || m.name.toLowerCase().includes('imagen')).map((m: any) => m.name));
  } catch(e) {
    console.error(e);
  }
}
listModels();
