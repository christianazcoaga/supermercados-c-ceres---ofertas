import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, ShoppingCart, Tag, ChevronRight, Info, AlertCircle, Percent, Phone, Mail, Camera, Image as ImageIcon, Upload, Download } from 'lucide-react';

const OFERTAS = [
  {
    id: 1,
    name: 'Asado de Novillo x Kg',
    oldPrice: 8500,
    newPrice: 5999,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800',
    tag: '¡LLEVALO YA!'
  },
  {
    id: 2,
    name: 'Yerba Mate Playadito 1Kg',
    oldPrice: 4200,
    newPrice: 2899,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1628543108315-7e502421b4a6?auto=format&fit=crop&q=80&w=800',
    tag: 'OFERTAZO'
  },
  {
    id: 3,
    name: 'Aceite de Girasol Natura 1.5L',
    oldPrice: 3100,
    newPrice: 1999,
    discount: 35,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    tag: 'PRECIO ACORDADO'
  },
  {
    id: 4,
    name: 'Leche Larga Vida La Serenísima 1L',
    oldPrice: 1500,
    newPrice: 999,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800',
    tag: 'IMPERDIBLE'
  },
  {
    id: 5,
    name: 'Arroz Gallo Oro 1Kg',
    oldPrice: 2800,
    newPrice: 1850,
    discount: 34,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=800',
    tag: 'OFERTAZO'
  },
  {
    id: 6,
    name: 'Coca-Cola Sabor Original 2.25L',
    oldPrice: 3500,
    newPrice: 2499,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    tag: '¡LLEVALO YA!'
  }
];

const SUCURSALES = [
  {
    name: 'Hipermercado Cáceres',
    address: 'Av. Independencia',
    hours: 'Todos los días de 8:00 a 22:00',
    type: 'Hipermercado'
  },
  {
    name: 'Supermercado Cáceres I',
    address: 'Belgrano 940',
    hours: '7:30 a 14:30 y 17:30 a 21:00',
    type: 'Supermercado'
  },
  {
    name: 'Supermercado Cáceres II',
    address: 'Uriburu y Luis Fontana',
    hours: 'Lunes a domingo, hasta las 22:30',
    type: 'Supermercado'
  },
  {
    name: 'Maximercado Cáceres',
    address: 'España 599',
    hours: 'Todos los días de 8:00 a 22:00',
    type: 'Maximercado'
  },
  {
    name: 'Sucursal Av. Gutnisky',
    address: 'Av. Gutnisky 2702',
    hours: 'Todos los días de 7:30 a 21:00',
    type: 'Supermercado'
  }
];

export default function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 15, hours: 10, minutes: 30, seconds: 0 });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productPrompt, setProductPrompt] = useState('Haz que este producto se vea profesional, de alta calidad, listo para catálogo e-commerce');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara');
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        setShowCamera(false);
        if (videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateProductImage = async () => {
    if (!capturedImage) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-product-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: capturedImage,
          prompt: productPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error types
        if (response.status === 429) {
          throw new Error('Cuota de API excedida. Por favor intenta más tarde o actualiza tu plan en Google AI Studio.');
        }
        if (response.status === 401) {
          throw new Error('API Key inválida. Verifica que tu GOOGLE_API_KEY sea correcta en el archivo .env');
        }
        throw new Error(data.details || data.error || 'Error al generar la imagen');
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-caceres-yellow selection:text-caceres-blue">
      {/* Top Bar */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-caceres-blue text-white py-2 px-4 text-sm font-medium flex justify-between items-center z-50 relative"
      >
        <div className="container mx-auto flex justify-between items-center">
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-caceres-yellow" />
            Orgullosamente Formoseños desde 1948
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <Percent size={16} className="text-caceres-yellow" />
            Descuentos especiales por pago en efectivo
          </span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white shadow-md sticky top-0 z-40 border-b-4 border-caceres-red"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <img src="/LOGO.png" alt="Grupo Cáceres" className="h-24 w-24 object-contain ml-6" />
          <nav className="hidden md:flex gap-6 font-bold text-slate-700 uppercase tracking-wide text-sm">
            <a href="#ofertas" className="text-caceres-red hover:text-caceres-blue transition-colors flex items-center gap-1">
              <Tag size={16} /> Ofertas del Mes
            </a>
            <a href="#sucursales" className="hover:text-caceres-blue transition-colors">Sucursales</a>
            <a href="#historia" className="hover:text-caceres-blue transition-colors">Nuestra Historia</a>
          </nav>
          <button className="md:hidden text-caceres-blue">
            <ShoppingCart size={28} />
          </button>
        </div>
      </motion.header>

      {/* Hero Section - OFERTAS DEL MES */}
      <section id="ofertas" className="relative bg-caceres-red overflow-hidden pt-12 pb-40">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="inline-block mb-6"
          >
            <span className="bg-caceres-yellow text-caceres-blue font-black px-6 py-2 rounded-full text-xl md:text-2xl uppercase tracking-widest shadow-lg transform -rotate-2 inline-block">
              ¡Explotaron los precios!
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl"
          >
            Ofertas <br/><span className="text-caceres-yellow">del Mes</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white text-xl md:text-3xl font-bold mb-10 max-w-3xl mx-auto"
          >
            Aprovechá estos precios increíbles en todas nuestras sucursales. ¡Stock limitado!
          </motion.p>

          {/* Countdown */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4 md:gap-8"
          >
            {[
              { label: 'Días', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Minutos', value: timeLeft.minutes },
              { label: 'Segundos', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="bg-white text-caceres-red font-display text-4xl md:text-6xl w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-xl shadow-xl mb-2">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <span className="text-white font-bold uppercase tracking-wider text-xs md:text-sm">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Wavy bottom divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.45,198.39,103.98,245.5,93.23,290.7,78.25,321.39,56.44Z" className="fill-slate-50"></path>
          </svg>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16 container mx-auto px-4 relative z-20 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {OFERTAS.map((oferta, idx) => (
            <motion.div 
              key={oferta.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-transparent hover:border-caceres-yellow transition-all group relative"
            >
              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-caceres-red text-white font-display text-3xl px-4 py-2 rounded-full z-10 shadow-lg transform rotate-12 group-hover:scale-110 transition-transform">
                -{oferta.discount}%
              </div>
              
              {/* Tag */}
              <div className="absolute top-4 left-0 bg-caceres-yellow text-caceres-blue font-bold px-4 py-1 uppercase tracking-wider text-sm z-10 shadow-md">
                {oferta.tag}
              </div>

              <div className="h-64 overflow-hidden relative bg-slate-100">
                <img 
                  src={oferta.image} 
                  alt={oferta.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-4 h-16 line-clamp-2 leading-tight">{oferta.name}</h3>
                
                <div className="flex flex-col items-center justify-center mb-6">
                  <span className="text-slate-400 line-through text-xl font-medium mb-1">
                    Antes: ${oferta.oldPrice}
                  </span>
                  <div className="flex items-start text-caceres-red">
                    <span className="text-3xl font-bold mt-2">$</span>
                    <span className="text-7xl font-display tracking-tighter leading-none">{oferta.newPrice}</span>
                  </div>
                </div>
                
                <button className="w-full bg-caceres-blue hover:bg-blue-900 text-white font-bold text-xl py-4 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={24} />
                  Ver Disponibilidad
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-4 border-caceres-red text-caceres-red hover:bg-caceres-red hover:text-white font-display text-2xl px-10 py-4 rounded-full uppercase tracking-widest transition-all inline-flex items-center gap-2"
          >
            Ver todas las ofertas <ChevronRight size={28} />
          </motion.button>
        </motion.div>
      </section>

      {/* History Section */}
      <section id="historia" className="bg-caceres-blue text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-caceres-red rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-caceres-yellow rounded-full blur-3xl opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl font-display uppercase tracking-tight mb-6 text-caceres-yellow">Más de 75 años con vos</h2>
              <div className="space-y-6 text-lg text-blue-100">
                <p>
                  Fundada por <strong className="text-white">Juan Bautista Cáceres en 1948</strong>, comenzamos como un pequeño almacén de ramos generales y panadería en el barrio San Miguel.
                </p>
                <p>
                  Hoy, consolidados como el <strong className="text-white">Grupo Cáceres</strong>, somos un gigante del supermercadismo en el Nordeste Argentino (NEA), bajo la dirección de Ricardo "Pilo" Cáceres y su hermano "Nene".
                </p>
                <div className="bg-blue-900/50 p-6 rounded-2xl border border-blue-800">
                  <h4 className="font-bold text-white text-xl mb-2 flex items-center gap-2">
                    <Info className="text-caceres-yellow" /> Nuestro Impacto
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-caceres-yellow mt-2"></div>
                      <span>Más de 27 sucursales en Formosa, Chaco, Corrientes y Misiones.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-caceres-yellow mt-2"></div>
                      <span>Propietarios de cadena Impulso y accionistas de California.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-caceres-yellow mt-2"></div>
                      <span>Uno de los principales empleadores privados de la provincia.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden border-8 border-white/10 relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1000" 
                  alt="Historia Supermercados Cáceres" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: -12 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.6 }}
                className="absolute -bottom-10 -left-10 bg-caceres-red text-white p-8 rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-2xl z-20 border-8 border-caceres-blue"
              >
                <span className="text-6xl font-display leading-none">1948</span>
                <span className="font-bold uppercase tracking-widest text-sm">Fundación</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sucursales */}
      <section id="sucursales" className="py-20 bg-slate-100">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-display text-caceres-blue uppercase tracking-tight mb-4">Encontrá tu sucursal</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Estamos cerca tuyo. Acercate a aprovechar nuestras ofertas en cualquiera de nuestras sucursales principales en Formosa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUCURSALES.map((sucursal, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-caceres-blue"
              >
                <div className="text-xs font-bold text-caceres-red uppercase tracking-wider mb-2">{sucursal.type}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{sucursal.name}</h3>
                <div className="space-y-3 text-slate-600">
                  <p className="flex items-start gap-3">
                    <MapPin className="text-caceres-blue shrink-0 mt-1" size={20} />
                    <span>{sucursal.address}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Clock className="text-caceres-yellow shrink-0 mt-1" size={20} />
                    <span>{sucursal.hours}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Generación de Imagen de Producto */}
      <section id="demo-imagen" className="py-20 bg-white border-y-4 border-caceres-blue">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-display text-caceres-blue uppercase tracking-tight mb-4">Demo: Generación de Imagen de Producto</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Sube una foto de tu producto o captura una con tu cámara y déjale a la IA de Google Gemini que la transforme en una imagen profesional de alta calidad.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-8 rounded-3xl border-4 border-caceres-blue"
            >
              <h3 className="text-2xl font-bold text-caceres-blue mb-6">Captura tu Producto</h3>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {!showCamera && !capturedImage && (
                <div className="space-y-6">
                  <button
                    onClick={startCamera}
                    className="w-full bg-caceres-yellow text-caceres-blue font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:shadow-lg transition-shadow"
                  >
                    <Camera size={24} />
                    Tomar Foto con Cámara
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-50 text-slate-600 font-medium">O</span>
                    </div>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-caceres-blue text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:shadow-lg transition-shadow"
                  >
                    <Upload size={24} />
                    Subir Imagen
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {showCamera && (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-xl border-2 border-caceres-blue"
                  />
                  <button
                    onClick={capturePhoto}
                    className="w-full bg-caceres-red text-white font-bold text-lg py-3 rounded-xl hover:shadow-lg transition-shadow"
                  >
                    Capturar Foto
                  </button>
                </div>
              )}

              {capturedImage && (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-xl overflow-hidden border-4 border-caceres-yellow">
                    <img src={capturedImage} alt="Capturada" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => {
                      setCapturedImage(null);
                      setGeneratedImage(null);
                    }}
                    className="w-full bg-slate-400 text-white font-bold py-2 rounded-lg hover:bg-slate-500 transition-colors"
                  >
                    Tomar Otra Foto
                  </button>
                </div>
              )}
            </motion.div>

            {/* Generated Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-8 rounded-3xl border-4 border-caceres-red"
            >
              <h3 className="text-2xl font-bold text-caceres-red mb-6">Imagen Profesional Generada</h3>
              
              {capturedImage && !generatedImage && (
                <div className="space-y-4 mb-6">
                  <label className="block text-sm font-bold text-slate-700">
                    Personaliza tu instrucción:
                  </label>
                  <textarea
                    value={productPrompt}
                    onChange={(e) => setProductPrompt(e.target.value)}
                    placeholder="Describe cómo quieres que se vea el producto..."
                    className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-caceres-red focus:outline-none resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-slate-500">
                    💡 Tip: Incluye detalles como "fondo blanco", "lighting profesional", "vista 45 grados", "estilo minimalista", etc.
                  </p>
                </div>
              )}
              
              {!capturedImage ? (
                <div className="aspect-square bg-slate-200 rounded-xl flex items-center justify-center border-4 border-dashed border-slate-300">
                  <div className="text-center">
                    <ImageIcon size={64} className="text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Captura o sube una imagen primero</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {!generatedImage && !analysis ? (
                    <>
                      <button
                        onClick={generateProductImage}
                        disabled={isGenerating}
                        className="w-full bg-caceres-red text-white font-bold text-lg py-4 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generando...
                          </>
                        ) : (
                          <>
                            <ImageIcon size={24} />
                            Generar Imagen Profesional
                          </>
                        )}
                      </button>
                      <p className="text-sm text-slate-600 text-center">
                        La IA transformará tu foto en una imagen profesional de producto
                      </p>
                    </>
                  ) : generatedImage ? (
                    <div className="space-y-4">
                      <div className="aspect-square bg-white rounded-xl overflow-hidden border-4 border-caceres-yellow">
                        <img src={generatedImage} alt="Generada" className="w-full h-full object-cover" />
                      </div>
                      <a
                        href={generatedImage}
                        download="producto-generado.jpg"
                        className="w-full bg-caceres-blue text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-blue-900"
                      >
                        <Download size={20} />
                        Descargar Imagen
                      </a>
                      <button
                        onClick={() => {
                          setGeneratedImage(null);
                          setCapturedImage(null);
                          setAnalysis(null);
                        }}
                        className="w-full bg-slate-400 text-white font-bold py-2 rounded-lg hover:bg-slate-500 transition-colors"
                      >
                        Generar Otra
                      </button>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg max-h-96 overflow-y-auto">
                        <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                          <span className="text-xl">✅</span> Análisis Profesional Completado
                        </h4>
                        <div className="text-sm text-slate-700 whitespace-pre-line font-mono text-xs leading-relaxed">
                          {analysis}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAnalysis(null);
                          setCapturedImage(null);
                          setProductPrompt('Haz que este producto se vea profesional, de alta calidad, listo para catálogo e-commerce');
                        }}
                        className="w-full bg-caceres-blue text-white font-bold py-3 rounded-lg hover:shadow-lg transition-colors"
                      >
                        Analizar Otra Imagen
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t-8 border-caceres-red">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            <div>
              <div className="mb-6">
                <img src="/LOGO.png" alt="Grupo Cáceres" className="h-20 w-20 object-contain" />
              </div>
              <p className="mb-6">
                Una de las instituciones comerciales más emblemáticas de Formosa, con una trayectoria que supera los 75 años.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-caceres-blue transition-colors cursor-pointer">
                  <span className="font-bold text-white">FB</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-caceres-blue transition-colors cursor-pointer">
                  <span className="font-bold text-white">IG</span>
                </motion.div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6">Enlaces Rápidos</h3>
              <ul className="space-y-3">
                <li><a href="#ofertas" className="hover:text-caceres-yellow transition-colors">Ofertas del Mes</a></li>
                <li><a href="#sucursales" className="hover:text-caceres-yellow transition-colors">Sucursales</a></li>
                <li><a href="#historia" className="hover:text-caceres-yellow transition-colors">Nuestra Historia</a></li>
                <li><a href="#" className="hover:text-caceres-yellow transition-colors">Trabajá con nosotros</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6">Contacto</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Phone className="text-caceres-yellow" size={20} />
                  <span>0800-XXX-CACERES</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-caceres-yellow" size={20} />
                  <span>contacto@grupocaceres.com.ar</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="text-caceres-yellow shrink-0 mt-1" size={20} />
                  <span className="text-sm">Participamos en programas de precios acordados con el gobierno provincial.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {new Date().getFullYear()} Grupo Cáceres. Todos los derechos reservados.</p>
            <p className="mt-2 md:mt-0">Orgullosamente de Formosa para todo el NEA.</p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
