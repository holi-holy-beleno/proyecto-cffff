const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración de CORS
app.use(cors({
  origin: true, // Permite cualquier origen reflejando la petición
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Importar rutas
const clientesRoutes = require('./routes/clientes');
const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');

// Usar prefijo estándar /api
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
