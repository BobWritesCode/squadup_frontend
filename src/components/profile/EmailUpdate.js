import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import btnStyles from '../../styles/Buttons.module.css';
import { axiosReq } from '../../contexts/CurrentUserContext';
import modalStyles from '../../styles/Modal.module.css';
import formStyles from '../../styles/Forms.module.css';
import LoadSpinner from '../Spinner';
import PropTypes from 'prop-types';

const EmailUpdate = (props) => {
  const { onEmailChange } = props;
  // Modal functions
  const [show, setShow] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const handleClose = () => {
    setErrors({});
    setShow(false);
  };
  const handleShow = () => {
    setFormData({ email: '' });
    setShow(true);
  };

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
    setShowSpinner(true);
    setErrors({});
    try {
      await axiosReq.put(`/profiles/email/${id}/`, email);
      // update the email in the other component
      onEmailChange(email);
      handleClose();
    } catch (err) {
      setErrors(err.response?.data);
    } finally {
      setShowSpinner(false);
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
          <Modal.Title>Update Email</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyles.Body}>
          <Form className={formStyles.Form} onSubmit={handleSubmit}>
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
                We&apo;ll never share your email with anyone else.
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
        <Modal.Footer className={modalStyles.Footer}>
          {showSpinner ? (
            <LoadSpinner />
          ) : (
            <>
              <Button variant="success" onClick={handleSubmit}>
                Save Changes
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Props validation
EmailUpdate.propTypes = {
  onEmailChange: PropTypes.func.isRequired,
};

export default EmailUpdate;
