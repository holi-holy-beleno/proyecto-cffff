import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/productos')
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          setProductos(data);
        } else if (data && Array.isArray(data.productos)) {
          setProductos(data.productos);
        } else {
          setProductos([]);
        }
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al cargar productos:', err);
        setError('No se pudo cargar la lista de productos desde la API.');
        setCargando(false);
      });
  }, []);

  if (cargando) return <div className="container mt-4"><p>Cargando productos...</p></div>;

  return (
    <div className="container mt-4">
      <h2>Listado de Productos</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad (Stock)</th>
            <th>Precio Unitario</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(productos) && productos.length > 0 ? (
            productos.map(p => {
              const id = p.id_producto || p.id;
              const nombre = p.nomProducto || p.nom_producto || p.nombre;
              const precio = Number(p.precio || 0);

              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{nombre}</td>
                  <td>{p.cantidad ?? p.stock ?? 0}</td>
                  <td>${precio.toLocaleString('es-CO')}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No hay productos registrados.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default Productos;
