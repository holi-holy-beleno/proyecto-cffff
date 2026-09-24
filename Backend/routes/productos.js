const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. CONSULTAR (GET)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error en GET /productos:', error);
    res.status(500).json({ error: 'Error interno al obtener productos' });
  }
});

// 2. AGREGAR (POST)
router.post('/', async (req, res) => {
  const { nomProducto, precio, stock } = req.body;

  if (!nomProducto || precio === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (nomProducto, precio)' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO productos (nomProducto, precio, stock) VALUES (?, ?, ?)',
      [nomProducto, precio, stock || 0]
    );
    res.status(201).json({ 
      id_producto: result.insertId, 
      nomProducto, 
      precio, 
      stock: stock || 0 
    });
  } catch (error) {
    console.error('Error en POST /productos:', error);
    res.status(500).json({ error: 'Error interno al crear producto' });
  }
});

// 3. ACTUALIZAR (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nomProducto, precio, stock } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE productos SET nomProducto=?, precio=?, stock=? WHERE id_producto=?',
      [nomProducto, precio, stock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error en PUT /productos:', error);
    res.status(500).json({ error: 'Error interno al actualizar producto' });
  }
});

// 4. ELIMINAR (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM productos WHERE id_producto = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error en DELETE /productos:', error);
    res.status(500).json({ error: 'Error interno al eliminar producto' });
  }
});

module.exports = router;
