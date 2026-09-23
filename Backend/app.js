const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Lista de orígenes permitidos (incluye tu frontend de Render y localhost)
const allowedOrigins = [
  'https://proyecto-cffff-1.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o curl) o si está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por políticas de CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Responder explícitamente a las peticiones Preflight con estado 200/204
app.options('*', cors());

app.use(express.json());

// Importar y registrar rutas
const clientesRoutes = require('./routes/clientes');
const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');

app.use('/api/clientes', clientesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'API Backend en funcionamiento' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
