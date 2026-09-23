import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from 'react-bootstrap/Table';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/productos')
      .then(response => {
        setProductos(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de productos');
        setCargando(false);
      });
  }, []);

  if (cargando) return <p className="container mt-3">Cargando productos...</p>;
  if (error) return <p className="container mt-3 text-danger">{error}</p>;

  return (
    <div className="container mt-3">
      <h2>Listado de Productos</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad (Stock)</th>
            <th>Precio Unitario</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nomProducto}</td>
              <td>{p.cantidad}</td>
              <td>${Number(p.precio).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Productos;