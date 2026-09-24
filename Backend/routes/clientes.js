import express from 'express';
import db from '../config/db.js'; // Obligatorio incluir .js en ES Modules

const router = express.Router();

// 1. CONSULTAR (GET)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (error) {
    console.error('Error en GET /clientes:', error);
    res.status(500).json({ error: 'Error interno al obtener clientes' });
  }
});

// 2. AGREGAR (POST)
router.post('/', async (req, res) => {
  const { nomCliente, contacto, departamento, ciudad } = req.body;

  if (!nomCliente || !contacto) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (nomCliente, contacto)' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO clientes (nomCliente, contacto, departamento, ciudad) VALUES (?, ?, ?, ?)',
      [nomCliente, contacto, departamento, ciudad]
    );
    res.status(201).json({ 
      id_cliente: result.insertId, 
      nomCliente, 
      contacto, 
      departamento, 
      ciudad 
    });
  } catch (error) {
    console.error('Error en POST /clientes:', error);
    res.status(500).json({ error: 'Error interno al crear cliente' });
  }
});

// 3. ACTUALIZAR (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nomCliente, contacto, departamento, ciudad } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE clientes SET nomCliente=?, contacto=?, departamento=?, ciudad=? WHERE id_cliente=?',
      [nomCliente, contacto, departamento, ciudad, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error('Error en PUT /clientes:', error);
    res.status(500).json({ error: 'Error interno al actualizar cliente' });
  }
});

// 4. ELIMINAR (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error en DELETE /clientes:', error);
    res.status(500).json({ error: 'Error interno al eliminar cliente' });
  }
});

export default router;
