import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import btnStyles from '../../styles/Buttons.module.css';
import { axiosReq } from '../../contexts/CurrentUserContext';
import { Image } from 'react-bootstrap';
import appStyles from '../../App.module.css';
import modalStyles from '../../styles/Modal.module.css';
import formStyles from '../../styles/Forms.module.css';

const PostEdit = (props) => {
  const { onEditPost, post } = props;

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
  const [formData, setFormData] = useState({
    content: content,
    contentLength: content.length,
    image: image,
  });

  // Used to display character count under note input
  const [charCount, setCharCount] = useState('');

  // Update character count on load
  useEffect(() => {
    setFormData({
      content: content,
      contentLength: content.length,
    });
  }, [content]);

  // Update character as user changes value of input
  useEffect(() => {
    setCharCount(String(formData.content).length);
  }, [formData]);

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
      const { data } = await axiosReq.patch(`/posts/${id}/`, formData);
      onEditPost(data.post);
      handleClose();
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <>
      <Button className={btnStyles.PanelButton} onClick={handleShow}>
        <i className="bi bi-pencil-square"></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className={modalStyles.Header}>
          <Modal.Title>Update post</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyles.Body}>
          <Form className={formStyles.Form}>
            <Form.Group className="mb-3" controlId="content">
              <Form.Control
                as="textarea"
                placeholder="Enter desired note"
                name="content"
                value={formData.content}
                onChange={handleChange}
                autoComplete="content"
              />
              <p>
                <Form.Text className={appStyles.SecondaryText}>
                  Max length 400 characters. ({charCount}/400)
                </Form.Text>
              </p>
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
          <Button variant="success" onClick={handleSubmit}>
            <i className="bi bi-save"></i> Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostEdit;
