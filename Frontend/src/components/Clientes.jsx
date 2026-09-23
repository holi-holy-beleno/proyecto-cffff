import { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Form, Modal, Container, Alert } from 'react-bootstrap';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nomCliente: '', contacto: '', departamento: '', ciudad: '' });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Carga de datos segura
  const cargarClientes = async () => {
    try {
      const res = await api.get('/clientes');
      // Garantiza que clientes siempre sea un Array
      if (Array.isArray(res.data)) {
        setClientes(res.data);
      } else if (res.data && Array.isArray(res.data.clientes)) {
        // En caso de que la respuesta venga envuelta como { clientes: [...] }
        setClientes(res.data.clientes);
      } else {
        setClientes([]);
      }
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setErrorMsg('No se pudieron obtener los clientes desde la API.');
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      if (editId) {
        // ACTUALIZAR
        await api.put(`/clientes/${editId}`, form);
      } else {
        // AGREGAR
        await api.post('/clientes', form);
      }
      await cargarClientes();
      handleClose();
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      setErrorMsg('Error al procesar la solicitud. Revisa los datos enviados.');
    }
  };

  const handleEdit = (cliente) => {
    // Soporte tanto para id_cliente como para id según la estructura retornada
    const id = cliente.id_cliente || cliente.id;
    setEditId(id);
    setForm({
      nomCliente: cliente.nomCliente || cliente.nom_cliente || '',
      contacto: cliente.contacto || '',
      departamento: cliente.departamento || '',
      ciudad: cliente.ciudad || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      try {
        await api.delete(`/clientes/${id}`);
        cargarClientes();
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
        setErrorMsg('No se pudo eliminar el cliente.');
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditId(null);
    setForm({ nomCliente: '', contacto: '', departamento: '', ciudad: '' });
    setErrorMsg('');
  };

  return (
    <Container className="mt-4">
      <h2>Gestión de Clientes</h2>
      
      {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}

      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        + Agregar Cliente
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Departamento</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(clientes) && clientes.length > 0 ? (
            clientes.map((c) => {
              const id = c.id_cliente || c.id;
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{c.nomCliente || c.nom_cliente}</td>
                  <td>{c.contacto}</td>
                  <td>{c.departamento}</td>
                  <td>{c.ciudad}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(c)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No hay clientes registrados o no se pudo cargar la lista.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal para Crear y Editar */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Cliente' : 'Agregar Cliente'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="nomCliente" value={form.nomCliente} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contacto</Form.Label>
              <Form.Control type="text" name="contacto" value={form.contacto} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Departamento</Form.Label>
              <Form.Control type="text" name="departamento" value={form.departamento} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control type="text" name="ciudad" value={form.ciudad} onChange={handleChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button variant="success" type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Clientes;
