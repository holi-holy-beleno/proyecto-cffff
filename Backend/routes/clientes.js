const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. CONSULTAR (GET)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// 2. AGREGAR (POST)
router.post('/', async (req, res) => {
  const { nomCliente, contacto, departamento, ciudad } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO clientes (nomCliente, contacto, departamento, ciudad) VALUES (?, ?, ?, ?)',
      [nomCliente, contacto, departamento, ciudad]
    );
    res.status(201).json({ id_cliente: result.insertId, nomCliente, contacto, departamento, ciudad });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// 3. ACTUALIZAR (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nomCliente, contacto, departamento, ciudad } = req.body;
  try {
    await db.query(
      'UPDATE clientes SET nomCliente=?, contacto=?, departamento=?, ciudad=? WHERE id_cliente=?',
      [nomCliente, contacto, departamento, ciudad, id]
    );
    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// 4. ELIMINAR (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;