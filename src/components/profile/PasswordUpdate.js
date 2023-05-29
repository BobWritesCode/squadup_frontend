import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import btnStyles from '../../styles/Buttons.module.css';
import { axiosReq } from '../../contexts/CurrentUserContext';
import modalStyles from '../../styles/Modal.module.css';
import formStyles from '../../styles/Forms.module.css';

const PasswordUpdate = () => {
  // Modal functions
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setErrors({});
    setShow(false);
  };
  const handleShow = () => {
    setFormData({
      old_password: '',
      new_password1: '',
      new_password2: '',
    });
    setShow(true);
  };

  // set up variables for fields used in this component
  const [formData, setFormData] = useState({
    old_password: '',
    new_password1: '',
    new_password2: '',
  });
  const { old_password, new_password1, new_password2 } = formData;

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
    setErrors({});
    const formData = new FormData();
    formData.append('old_password', old_password);
    formData.append('new_password1', new_password1);
    formData.append('new_password2', new_password2);
    try {
      await axiosReq.post('/dj-rest-auth/password/change/', formData);
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
        <Modal.Header className={modalStyles.Header}>
          <Modal.Title>Update Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyles.Body}>
          <Form className={formStyles.Form}>
            <Form.Group className="mb-3" controlId="old_password">
              <Form.Label>Current password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter current password"
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                autoComplete="old_password"
              />
            </Form.Group>
            {errors.old_password?.map((m, idx) => (
              <Alert variant="warning" key={idx}>
                {m}
              </Alert>
            ))}

            <Form.Group className="mb-3" controlId="new_password1">
              <Form.Label>New password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                name="new_password1"
                value={formData.new_password1}
                onChange={handleChange}
                autoComplete="new_password1"
              />
            </Form.Group>
            {errors.new_password1?.map((m, idx) => (
              <Alert variant="warning" key={idx}>
                {m}
              </Alert>
            ))}

            <Form.Group className="mb-3" controlId="new_password2">
              <Form.Label>Confirm new password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Retype new password"
                name="new_password2"
                value={formData.new_password2}
                onChange={handleChange}
                autoComplete="new_password2"
              />
            </Form.Group>
            {errors.new_password2?.map((m, idx) => (
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

        <Modal.Footer className={modalStyles.Footer}>
          <Button variant="success" onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PasswordUpdate;
