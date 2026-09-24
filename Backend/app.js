import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientesRouter from './routes/clientes.js';
import productosRouter from './routes/productos.js';
import ventasRouter from './routes/ventas.js';

dotenv.config();

const app = express();

// Lista de origenes permitidos (Localhost y Render)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://proyecto-cffff-1.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o Server-to-Server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por políticas de CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Registro de rutas bajo el prefijo /api
app.use('/api/clientes', clientesRouter);
app.use('/api/productos', productosRouter);
app.use('/api/ventas', ventasRouter);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
