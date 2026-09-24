import express from 'express';
import db from '../config/db.js'; // Extensión .js obligatoria en ES Modules

const router = express.Router();

// 1. CONSULTAR VENTAS (GET)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        v.id_venta, 
        v.id_cliente,
        IFNULL(c.nomCliente, 'Cliente no registrado') AS nomCliente, 
        v.fecha_venta, 
        v.total, 
        v.estado
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      ORDER BY v.id_venta DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error en GET /ventas:', error);
    res.status(500).json({ error: 'Error interno al obtener las ventas' });
  }
});

// 2. CREAR VENTA (POST)
router.post('/', async (req, res) => {
  const { id_cliente, total, estado, detalles } = req.body;

  if (!id_cliente || total === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (id_cliente, total)' });
  }

  // Obtener conexión para manejar la transacción de forma segura
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Insertar la cabecera de la venta
    const [resultVenta] = await connection.query(
      'INSERT INTO ventas (id_cliente, total, estado, fecha_venta) VALUES (?, ?, ?, NOW())',
      [id_cliente, total, estado || 'Completado']
    );

    const idVentaCreada = resultVenta.insertId;

    // Si se enviaron detalles de productos (arreglo de objetos)
    if (Array.isArray(detalles) && detalles.length > 0) {
      for (const item of detalles) {
        // Insertar en la tabla detalle_ventas
        await connection.query(
          'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [idVentaCreada, item.id_producto, item.cantidad, item.precio_unitario]
        );

        // Descontar stock del producto
        await connection.query(
          'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
          [item.cantidad, item.id_producto]
        );
      }
    }

    await connection.commit();
    res.status(201).json({
      id_venta: idVentaCreada,
      id_cliente,
      total,
      estado: estado || 'Completado',
      message: 'Venta registrada exitosamente'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en POST /ventas:', error);
    res.status(500).json({ error: 'Error al registrar la venta. Transacción cancelada.' });
  } finally {
    connection.release();
  }
});

// 3. CAMBIAR ESTADO DE VENTA (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE ventas SET estado = ? WHERE id_venta = ?',
      [estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json({ message: 'Estado de venta actualizado correctamente' });
  } catch (error) {
    console.error('Error en PUT /ventas:', error);
    res.status(500).json({ error: 'Error al actualizar el estado de la venta' });
  }
});

export default router;
