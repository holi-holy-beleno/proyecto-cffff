import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/ventas')
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          setVentas(data);
        } else if (data && Array.isArray(data.ventas)) {
          setVentas(data.ventas);
        } else {
          setVentas([]);
        }
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al cargar ventas:', err);
        setError('No se pudo cargar la lista de ventas desde la API.');
        setCargando(false);
      });
  }, []);

  // Formateador seguro de fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'N/A';
    const fecha = new Date(fechaStr);
    return isNaN(fecha.getTime()) ? 'Fecha inválida' : fecha.toLocaleString('es-CO');
  };

  if (cargando) return <div className="container mt-4"><p>Cargando ventas...</p></div>;

  return (
    <div className="container mt-4">
      <h2>Historial de Ventas</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive className="mt-3">
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
          {Array.isArray(ventas) && ventas.length > 0 ? (
            ventas.map((v) => {
              const id = v.id_venta || v.id_factura || v.id;
              const cliente = v.nomCliente || v.nom_cliente || v.cliente || 'Cliente General';
              const total = Number(v.total || v.monto || 0);
              const estado = v.estado || 'Completada';

              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{cliente}</td>
                  <td>{formatearFecha(v.fecha_venta || v.fecha)}</td>
                  <td>${total.toLocaleString('es-CO')}</td>
                  <td>
                    <Badge bg={estado === 'Completada' ? 'success' : 'warning'}>
                      {estado}
                    </Badge>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No hay ventas registradas.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default Ventas;
