import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { axiosRes } from '../../api/axiosDefaults';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import btnStyles from '../../styles/Buttons.module.css';

const UsernameUpdate = (props) => {
  const { onUsernameChange } = props;

  // Modal functions
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // get current user
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  // react route dom navigation
  const navigate = useNavigate();

  // get current user id
  const { id } = useParams();

  // set up variables for fields used in this component
  const [formData, setFormData] = useState({
    username: '',
  });
  const { username } = formData;

  // set up variables for errors from request.
  const [errors, setErrors] = useState({});

  // Allow user to edit form.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setFormData({ username: currentUser.username });
    } else {
      navigate('/');
    }
  }, [currentUser, navigate, id]);

  // Handle submit on button press
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    try {
      await axiosRes.put(`/dj-rest-auth/user/`, formData);
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      // update the username in the other component
      onUsernameChange(username);
      handleClose()
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
          <Modal.Title>Update Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>New username</Form.Label>
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
              <Alert variant="warning" key={idx} dismissible>
                {m}
              </Alert>
            ))}

            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3" dismissible>
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

export default UsernameUpdate;
