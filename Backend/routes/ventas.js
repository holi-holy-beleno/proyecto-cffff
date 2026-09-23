const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT v.id_venta, c.nomCliente, v.fecha_venta, v.total, v.estado
      FROM ventas v
      JOIN clientes c ON v.id_cliente = c.id_cliente
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

module.exports = router;