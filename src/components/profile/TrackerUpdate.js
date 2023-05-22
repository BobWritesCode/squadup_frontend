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

const TrackerUpdate = (props) => {
  const { onTrackerChange } = props;
  // Modal functions
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setErrors({});
    setShow(false);
  };
  const handleShow = () => {
    setFormData({ tracker: '' });
    setShow(true);
  };

  // get current user id
  const { id } = useParams();

  // set up variables for fields used in this component
  const [formData, setFormData] = useState({
    tracker: '',
  });
  const { tracker } = formData;

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
    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, {
        tracker: tracker,
      });
      // update the username in the other component
      onTrackerChange(data.response);
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
          <Modal.Title>Update tracker ID</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyles.Body}>
          <Form className={formStyles.Form}>
            <Form.Group className="mb-3" controlId="tracker">
              <Form.Label>
                Please enter your player name and hashtag number as it is on
                tracker.gg.
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="example: Player Name#1234"
                name="tracker"
                value={formData.tracker}
                onChange={handleChange}
                autoComplete="tracker"
              />
              <Form.Text>
                Your tracker.gg profile must be set to public for people to see.
              </Form.Text><br/>
              <Form.Text>
                Example: Player Name#1234
              </Form.Text>
            </Form.Group>

            {errors.tracker?.map((m, idx) => (
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

export default TrackerUpdate;
