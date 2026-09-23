import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/ventas')
      .then(response => {
        setVentas(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de ventas');
        setCargando(false);
      });
  }, []);

  if (cargando) return <p className="container mt-3">Cargando ventas...</p>;
  if (error) return <p className="container mt-3 text-danger">{error}</p>;

  return (
    <div className="container mt-3">
      <h2>Historial de Ventas</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id_venta}>
              <td>{v.id_venta}</td>
              <td>{v.nomCliente}</td>
              <td>{new Date(v.fecha_venta).toLocaleString()}</td>
              <td>${Number(v.total).toLocaleString()}</td>
              <td>
                <Badge bg={v.estado === 'Completada' ? 'success' : 'warning'}>
                  {v.estado}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Ventas;