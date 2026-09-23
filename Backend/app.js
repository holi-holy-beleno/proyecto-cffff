const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración explícita y permisiva de CORS
app.use(cors({
  origin: true, // Permite dinámicamente cualquier origen reflejando la petición (incluye Vercel y Render)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Responder explícitamente a solicitudes preflight (OPTIONS)
app.options('*', cors());

app.use(express.json());

// Importar rutas
const clientesRoutes = require('./routes/clientes');
const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');

// Definir rutas de API
app.use('/api/clientes', clientesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);

app.use('/clientes', clientesRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);

// Ruta de health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'API Backend en funcionamiento' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
