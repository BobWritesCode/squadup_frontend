import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import btnStyles from '../../styles/Buttons.module.css';
import { axiosReq } from '../../contexts/CurrentUserContext';
import modalStyles from '../../styles/Modal.module.css';
import formStyles from '../../styles/Forms.module.css';

const UserNoteUpdate = (props) => {
  const { onUserNoteChange, userNote } = props;
  const { id, content } = userNote;
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
    id: id,
    content: content,
    contentLength: String(content).length,
  });

  // Used to display character count under note input
  const [charCount, setCharCount] = useState('');

  // Update character count on load
  useEffect(() => {
    setFormData({
      id: id,
      content: content,
      contentLength: String(content).length,
    });
  }, [id, content]);

  // Update character as user changes value of input
  useEffect(() => {
    setCharCount(String(formData.content).length);
  }, [formData.content]);

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
      const { data } = await axiosReq.patch(
        `/usernotes/${formData.id}/`,
        formData,
      );
      onUserNoteChange(data.post);
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
        <Modal.Header className={modalStyles.Header}>
          <Modal.Title>Leave a note</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyles.Body}>
          <Form className={formStyles.Form}>
            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Note:</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter desired note"
                name="content"
                value={formData.content}
                onChange={handleChange}
                autoComplete="content"
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

export default UserNoteUpdate;
