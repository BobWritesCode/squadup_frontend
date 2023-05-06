import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { axiosRes } from '../../api/axiosDefaults';
import btnStyles from '../../styles/Buttons.module.css';

const EmailUpdate = (props) => {
  const { onEmailChange } = props;
  // Modal functions
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setFormData({ email: '' });
    setShow(true);
  }

  // get current user id
  const { id } = useParams();

  // set up variables for fields used in this component
  const [formData, setFormData] = useState({
    email: '',
  });
  const { email } = formData;

  // set up variables for errors from request.
  const [errors, setErrors] = useState({});

  // Allow user to edit form.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit on button press
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/profiles/email/${id}`, email);
      // update the email in the other component
      onEmailChange(email);
      handleClose();
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  // Render
  return (
    <>
      <Button className={btnStyles.Icon} onClick={handleShow}>
        <i className="bi bi-pencil-square"></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email new address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email address"
                name="email"
                value={email}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            {errors.email?.map((m, idx) => (
              <Alert variant="warning" key={idx}>
                {m}
              </Alert>
            ))}

            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmailUpdate;
