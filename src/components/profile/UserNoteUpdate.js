import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { axiosReq } from '../../api/axiosDefaults';
import btnStyles from '../../styles/Buttons.module.css';
import { useParams } from 'react-router-dom';

const UserNoteUpdate = (props) => {
  const { onUserNoteChange, userNote } = props;

  // set up variables for errors from request.
  const [errors, setErrors] = useState({});

  // Modal functions
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setErrors({});
    setShow(false);
  };
  const handleShow = () => setShow(true);

  // set up variables for fields used in this component
  const [formData, setFormData] = useState({
    userNote: userNote,
    userNoteLength: userNote[0].length,
  });

  // Used to display character count under note input
  const [charCount, setCharCount] = useState('');

  // Update character count on load
  useEffect(() => {
    setFormData({ userNote: userNote, userNoteLength: userNote[0].length });
  }, [userNote]);

  // Update character as user changes value of input
  useEffect(() => {
    setCharCount(String(formData.userNote).length);
  }, [formData.userNote]);

  // Allow user to edit form.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // get current user id
  const { id } = useParams();

  // Handle submit on button press
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    try {
      const { data } = await axiosReq.put(`/usernotes/${id}`, formData);
      onUserNoteChange(data.user_note);
      handleClose();
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <>
      <Button className={btnStyles.Icon} onClick={handleShow}>
        <i className="bi bi-pencil-square"></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Leave a note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="userNote">
              <Form.Label>Note:</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter desired note"
                name="userNote"
                value={formData.userNote}
                onChange={handleChange}
                autoComplete="userNote"
              />
              <p>
                <Form.Text>
                  Max length 200 characters. ({charCount}/200)
                </Form.Text>
              </p>
            </Form.Group>

            {errors.userNote?.map((m, idx) => (
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

export default UserNoteUpdate;
