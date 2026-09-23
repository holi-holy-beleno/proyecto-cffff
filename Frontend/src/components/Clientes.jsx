import { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Form, Modal, Container } from 'react-bootstrap';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nomCliente: '', contacto: '', departamento: '', ciudad: '' });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cargarClientes = () => {
    api.get('/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // ACTUALIZAR
      api.put(`/clientes/${editId}`, form).then(() => {
        cargarClientes();
        handleClose();
      });
    } else {
      // AGREGAR
      api.post('/clientes', form).then(() => {
        cargarClientes();
        handleClose();
      });
    }
  };

  const handleEdit = (cliente) => {
    setEditId(cliente.id_cliente);
    setForm({
      nomCliente: cliente.nomCliente,
      contacto: cliente.contacto,
      departamento: cliente.departamento,
      ciudad: cliente.ciudad
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      api.delete(`/clientes/${id}`).then(() => cargarClientes());
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditId(null);
    setForm({ nomCliente: '', contacto: '', departamento: '', ciudad: '' });
  };

  return (
    <Container className="mt-4">
      <h2>Gestión de Clientes</h2>
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
          {clientes.map(c => (
            <tr key={c.id_cliente}>
              <td>{c.id_cliente}</td>
              <td>{c.nomCliente}</td>
              <td>{c.contacto}</td>
              <td>{c.departamento}</td>
              <td>{c.ciudad}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(c)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(c.id_cliente)}>Eliminar</Button>
              </td>
            </tr>
          ))}
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