import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Toaster, toast } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.css";
import "./Directorio.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Busqueda from "./Busqueda";

const DirectorioDeContactos = () => {
  /* Variables inicializadas */
  const [contactos, setContactos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [correo, setCorreo] = useState("");
  const [contactoEditado, setContactoEditado] = useState(null);

  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

  /* Buscador */
  const [busqueda, setBusqueda] = useState("");

  const buscarContactos = (terminoBusqueda) => {
    setBusqueda(terminoBusqueda);

    const resultados = contactos.filter(
      (contacto) =>
        contacto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        contacto.correo.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );

    setResultadosBusqueda(resultados);
  };

  /* Efecto que permite traducir los contactos para guardarlos en un archivo Local Json */
  useEffect(() => {
    const contactosAlmacenados = JSON.parse(localStorage.getItem("contactos"));
    if (contactosAlmacenados && contactosAlmacenados.length > 0) {
      setContactos(contactosAlmacenados);
    }
  }, []);

  /*  */
  useEffect(() => {
    localStorage.setItem("contactos", JSON.stringify(contactos));
  }, [contactos]);

  /* Función para agregar un contacto */
  const agregarContacto = (event) => {
    event.preventDefault();

    if (contactoEditado) {
      // Editar contacto existente
      const contactosActualizados = contactos.map((contacto) => {
        if (contacto.id === contactoEditado.id) {
          return {
            ...contacto,
            nombre: nombre,
            numero: numero,
            correo: correo,
          };
        }
        return contacto;
      });

      setContactos(contactosActualizados);
      setContactoEditado(null);
    } else {
      // Crear nuevo contacto
      const nuevoContacto = {
        id: Math.random(1),
        nombre: nombre,
        numero: numero,
        correo: correo,
      };

      setContactos([...contactos, nuevoContacto]);
    }

    setNombre("");
    setNumero("");
    setCorreo("");

    toast.success("Contacto agregado correctamente");
  };

  const cambiarNombre = (event) => {
    setNombre(event.target.value);
  };

  const cambiarNumero = (event) => {
    setNumero(event.target.value);
  };

  const cambiarCorreo = (event) => {
    setCorreo(event.target.value);
  };

  const editarContacto = (id) => {
    const contactoSeleccionado = contactos.find(
      (contacto) => contacto.id === id
    );
    setContactoEditado(contactoSeleccionado);
    setNombre(contactoSeleccionado.nombre);
    setNumero(contactoSeleccionado.numero);
    setCorreo(contactoSeleccionado.correo);

    toast.success("Contacto editado correctamente");
  };

  const eliminarContacto = (id) => {
    const quiereEliminar = window.confirm(
      "¿Estás seguro de eliminar el contacto?"
    );
    if (quiereEliminar) {
      const contactosActualizados = contactos.filter(
        (contacto) => contacto.id !== id
      );
      setContactos(contactosActualizados);

      toast.success("Contacto eliminado correctamente");

      if (contactoEditado && contactoEditado.id === id) {
        setContactoEditado(null);
      }
    }
  };


  const validarFormulario = () => {
    const correoRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!correoRe.test(correo)) {
      toast.error("Por favor, ingrese un correo válido");
      return false;
    }


  }
  return (
    <div
      className="contact-directory-container order-sm-first order-lg-last text-center"
      id="cuerpoMain"
    >
      <Container className="mt-5 text-center">
        <Toaster />
        <h2 className="text-center mb-4 titulo p-3">Directorio de Contactos</h2>
        <Container className="buscador">
          <Busqueda buscarContactos={buscarContactos} />
        </Container>

        <Form
          onSubmit={agregarContacto}
          className="formulario mt-5 me-auto ms-auto"
        >
          <Row className="justify-content-center fila ms-auto me-auto">
            <Col xs={12} md={6}>
              <Row className="text-center mt-4">
                <Col md={1}>
                  <i class="bi bi-person-badge fs-2"></i>
                </Col>
                <Col md={11}>
                  <Form.Group className="mb-3 text-center mt-3">
                    <Form.Control
                      type="text"
                      placeholder="Nombre de contacto"
                      value={nombre}
                      className="input-text"
                      onChange={cambiarNombre}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={1}>
                  <i class="bi bi-telephone fs-2"></i>
                </Col>
                <Col md={11}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="tel"
                      placeholder="Número de teléfono"
                      value={numero}
                      className="input-text"
                      onChange={cambiarNumero}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={1}>
                  <i class="bi bi-envelope fs-2"></i>
                </Col>
                <Col md={11}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Correo Electrônico"
                      value={correo}
                      className="input-text"
                      onChange={cambiarCorreo}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                variant="primary"
                type="submit"
                className="button-animation mt-3 mb-3"
              >
                {contactoEditado ? "Guardar cambios" : "Agregar contacto"}
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="mt-4 justify-content-center">
          <Col xs={12} className="d-flex flex-wrap justify-content-center">
            <TransitionGroup component={null}>
              {busqueda
                ? resultadosBusqueda.map((contacto) => (
                    
                      <CSSTransition
                        key={contacto.id}
                        classNames="fade"
                        timeout={300}
                      >
                        <Col
                          xs={12}
                          md={6}
                          lg={4}
                          className="mb-3 d-flex justify-content-center"
                        >
                          <Card className="p-1">
                            <Card.Header className="d-flex justify-content-end">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => editarContacto(contacto.id)}
                                className="mx-1"
                              >
                                Editar <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => eliminarContacto(contacto.id)}
                                className="mx-1"
                              >
                                Eliminar <i className="bi bi-x-circle"></i>
                              </Button>
                            </Card.Header>
                            <Card.Body className="cuerpoCarta p-5">
                              <Card.Text className="tituloCarta p-2 card-text">
                                Nombre: {contacto.nombre}
                              </Card.Text>
                              <Card.Text className="card-text tituloCarta p-2">
                                Número: {contacto.numero}
                              </Card.Text>
                              <Card.Text className="card-text tituloCarta p-2">
                                Correo: {contacto.correo}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      </CSSTransition>
              
                  ))
                : contactos.map((contacto) => (
                    <CSSTransition
                      key={contacto.id}
                      classNames="fade"
                      timeout={300}
                    >
                      <Col
                        xs={12}
                        md={6}
                        lg={4}
                        className="mb-3 d-flex justify-content-center"
                      >
                        <Card className="p-1">
                          <Card.Header className="d-flex justify-content-end">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => editarContacto(contacto.id)}
                              className="mx-1"
                            >
                              Editar <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => eliminarContacto(contacto.id)}
                              className="mx-1"
                            >
                              Eliminar <i className="bi bi-x-circle"></i>
                            </Button>
                          </Card.Header>
                          <Card.Body className="cuerpoCarta p-5">
                            <Card.Text className="tituloCarta p-2 card-text">
                              Nombre: {contacto.nombre}
                            </Card.Text>
                            <Card.Text className="card-text tituloCarta p-2">
                              Número: {contacto.numero}
                            </Card.Text>
                            <Card.Text className="card-text tituloCarta p-2">
                              Correo: {contacto.correo}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </CSSTransition>
                  ))}
            </TransitionGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DirectorioDeContactos;
