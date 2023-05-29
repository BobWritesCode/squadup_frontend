import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import btnStyles from '../../styles/Buttons.module.css';
import { axiosReq } from '../../contexts/CurrentUserContext';
import modalStyles from '../../styles/Modal.module.css';
import formStyles from '../../styles/Forms.module.css';
import LoadSpinner from '../Spinner';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserNoteUpdate = (props) => {
  const { onUserNoteChange, userNote } = props;
  const { content } = userNote;
  // Get url params
  const { id } = useParams();
  // Use to show spinner while waiting for API response
  const [showSpinner, setShowSpinner] = useState(false);
  // Use to any expected errors as alerts.
  const [errors, setErrors] = useState({});
  // Use to toggle showing modal.
  const [show, setShow] = useState(false);
  // Used to display character count under note input
  const [charCount, setCharCount] = useState('');
  // set up variables for fields used in this component
  const [formData, setFormData] = useState({
    id: id,
    content: content,
    contentLength: String(content).length,
  });

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
   * Update character as user changes value of input
   */
  useEffect(() => {
    setCharCount(String(formData.content).length);
  }, [formData.content]);

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

  /**
   * Makes API call to either post new data, or updated existing data, based on user input text field.
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Clear any error messages.
    setErrors({});
    // Show spinner while waiting for API to resolve.
    setShowSpinner(true);
    try {
      // Create new form to send controlled data to API.
      const apiData = new FormData();
      apiData.append('content', formData.content);
      apiData.append('target_user', id);
      if (!userNote.id) {
        // Create new object in database.
        const { data } = await axiosReq.post('/usernotes/', apiData);
        // Update parent component.
        onUserNoteChange(data);
      } else {
        // Update existing object in database.
        const { data } = await axiosReq.patch(
          `/usernotes/${userNote.id}/`,
          apiData,
        );
        // Update parent component.
        onUserNoteChange(data);
      }
      // Close modal
      handleClose();
    } catch (err) {
      // Log error messages to the console.
      console.log(err);
      // Displayed any expected error messages
      setErrors(err.response?.data);
    } finally {
      // Remove spinner from display.
      setShowSpinner(false);
    }
  };

  /**
   * JSX to show Form inside modal.
   */
  const ShowForm = (
    <>
      <Form className={formStyles.Form}>
        <Form.Group className="mb-2 d-flex flex-column" controlId="content">
          <Form.Label>Note:</Form.Label>
          <div className="d-flex flex-column w-100">
            <Form.Control
              className={'mb-0'}
              as="textarea"
              placeholder="Enter desired note"
              name="content"
              value={formData.content}
              onChange={handleChange}
            />

            <Form.Text className="ms-auto">({charCount}/200)</Form.Text>
          </div>
        </Form.Group>

        {errors.content?.map((m, idx) => (
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
    </>
  );

  return (
    <>
      <Button className={btnStyles.Icon} onClick={handleShow}>
        <i className="bi bi-pencil-square"></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className={modalStyles.Header}>
          <Modal.Title>Leave a note</Modal.Title>
        </Modal.Header>

        <Modal.Body className={modalStyles.Body}>{ShowForm}</Modal.Body>

        <Modal.Footer className={modalStyles.Footer}>
          {/*While API is waiting to be resolved show spinner, otherwise show button*/}
          {showSpinner ? (
            <LoadSpinner />
          ) : (
            <Button variant="success" onClick={handleSubmit}>
              Save Changes
            </Button>
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
UserNoteUpdate.propTypes = {
  onUserNoteChange: PropTypes.object.isRequired,
  userNote: PropTypes.object.isRequired,
};

export default UserNoteUpdate;
