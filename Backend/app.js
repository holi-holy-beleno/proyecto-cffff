const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Lista de orígenes permitidos
const allowedOrigins = [
  'https://proyecto-cffff-1.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

// 2. Configuración global de CORS
app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (curl, Postman, server-to-server) o si están en la lista
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por políticas de CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Compatibilidad con navegadores antiguos (IE11/SmartTVs)
}));

// Middlewares
app.use(express.json());

// 3. Importar rutas
const clientesRoutes = require('./routes/clientes');
const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');

// 4. Registrar rutas principales con prefijo /api
app.use('/api/clientes', clientesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);

// Alias de respaldo por si el frontend consulta sin el prefijo /api
app.use('/clientes', clientesRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);

// Health check para monitoreo y Render
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'API Backend en funcionamiento' });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
