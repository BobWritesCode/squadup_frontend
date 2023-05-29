import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import btnStyles from '../../styles/Buttons.module.css';
import modalStyles from '../../styles/Modal.module.css';
import { axiosReq } from '../../contexts/CurrentUserContext';
import { Image } from 'react-bootstrap';
import formStyles from '../../styles/Forms.module.css';
import PropTypes from 'prop-types';

const PostDelete = (props) => {
  const { onDeletePost, post } = props;

  const { id, content, image } = post;

  // set up variables for errors from request.
  const [errors, setErrors] = useState({});

  // Modal functions
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setErrors({});
    setShow(false);
  };
  const handleShow = () => setShow(true);

  // Set up variables for fields used in this component
  const [formData, setFormData] = useState({});

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
      await axiosReq.delete(`/posts/${id}`);
      onDeletePost();
      handleClose();
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <>
      <Button className={btnStyles.PanelButton} onClick={handleShow}>
        <i className="bi bi-trash"></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className={modalStyles.Header}>
          <Modal.Title>Delete post</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyles.Body}>
          <Form className={formStyles.Form}>
            <Form.Group className="mb-3" controlId="content">
              <Form.Control
                as="textarea"
                placeholder="Enter desired note"
                name="content"
                value={content}
                onChange={handleChange}
                disabled
              />
            </Form.Group>

            {errors.content?.map((m, idx) => (
              <Alert variant="warning" key={idx}>
                {m}
              </Alert>
            ))}

            <Form.Group className="d-flex justify-content-center">
              <Image src={image} fluid rounded />
            </Form.Group>

            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className={modalStyles.Footer}>
          <Button variant="danger" onClick={handleSubmit}>
            <i className="bi bi-trash"></i> Delete Post
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Props validation
PostDelete.propTypes = {
  post: PropTypes.object.isRequired,
  onDeletePost: PropTypes.func.isRequired,
};

export default PostDelete;
