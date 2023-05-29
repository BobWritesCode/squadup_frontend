import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import {
  axiosReq,
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import btnStyles from '../../styles/Buttons.module.css';
import modalStyles from '../../styles/Modal.module.css';
import formStyles from '../../styles/Forms.module.css';
import LoadSpinner from '../Spinner';
import PropTypes from 'prop-types';

const UsernameUpdate = (props) => {
  const { onUsernameChange } = props;
  // get current user id
  const { id } = useParams();
  // get current user
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  // react route dom navigation
  const navigate = useNavigate();
  // Use to toggle showing spinner when waiting for data from API for request.
  const [showSpinner, setShowSpinner] = useState(false);
  // set up variables for errors from request.
  const [errors, setErrors] = useState({});
  // Use to toggle showing modal.
  const [show, setShow] = useState(false);
  // set up variables for fields used in this component
  const [formData, setFormData] = useState({
    username: '',
  });
  const { username } = formData;

  /**
   * Handle closing modal.
   */
  const handleClose = () => {
    setErrors({});
    setShow(false);
  };

  /**
   * Handle opening modal.
   */
  const handleShow = () => setShow(true);

  /**
   * Allow user to edit form.
   * @param {*} e
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({ username: currentUser.username });
    } else {
      navigate('/');
    }
  }, [currentUser, navigate, id]);

  /**
   * Handle sending form data to API and handle response
   *
   * If successful update username in browser.
   * If error, display any expected error message to the user.
   *
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Show spinner while API resolves.
    setShowSpinner(true);
    // Clear any error alerts.
    setErrors({});
    // Create new form to control data sent to API.
    const apiData = new FormData();
    apiData.append('username', username);
    try {
      await axiosReq.put('/dj-rest-auth/user/', apiData);
      // If change successful update authentication in browser.
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      // Update the username in parent component.
      onUsernameChange(username);
      // Close modal.
      handleClose();
    } catch (err) {
      // Display any expected error messages.
      setErrors(err.response?.data);
    } finally {
      // Remove spinner.
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
          <Modal.Title>Update Username</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyles.Body}>
          <Form className={formStyles.Form} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Update your username here.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter desired username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </Form.Group>

            {errors.username?.map((m, idx) => (
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
                Update username
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
UsernameUpdate.propTypes = {
  onUsernameChange: PropTypes.func.isRequired,
};

export default UsernameUpdate;
