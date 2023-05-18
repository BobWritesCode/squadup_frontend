import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import LoadSpinner from '../Spinner';
import { axiosReq } from '../../contexts/CurrentUserContext';

const NewPost = (props) => {
  const { onNewPost } = props;
  const imageFile = useRef();

  const [hasLoaded, setHasLoaded] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const [formData, setFormData] = useState({
    textbox: '',
    imagePath: '',
  });
  const { textbox, imagePath } = formData;

  // Used to display character count under note input
  const [charCount, setCharCount] = useState('');

  // Update character as user changes value of input
  useEffect(() => {
    setCharCount(String(textbox).length);
  }, [textbox]);

  // Allow user to edit form.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRemoveImage = (e) => {
    // Reset image control element to allow selecting same image.
    imageFile.current.value = null;
    setFormData({
      imagePath: '',
      textbox: textbox,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Show spinner
    setHasLoaded(false);
    // Remove any error alerts
    setErrors({});
    // Remove any success alerts
    setSuccess({});
    // Create new FormData object and append correct data.
    const apiData = new FormData();
    const apiImageFile = imagePath ? imageFile.current.files[0] : null;
    const apiTextBox = textbox === undefined ? '' : textbox;
    apiData.append('content', apiTextBox);
    apiData.append('image', apiImageFile);
    // Try block to submit form to api and get response
    try {
      const { data } = await axiosReq.post(`/posts/`, apiData);
      setFormData({
        textbox: '',
        imagePath: '',
      });
      onNewPost(data.postID);
      imageFile.current = undefined;
      // Show any success messages received from API.
      setSuccess(data);
    } catch (err) {
      console.log(err);
      if (err.response?.data !== 401) {
        // Show any error messages received from API.
        setErrors(err.response?.data);
      }
    } finally {
      // Remove spinner
      setHasLoaded(true);
    }
  };

  /**
   * Form to render.
   */
  const newPostForm = (
    <Form onSubmit={handleSubmit}>
      <Form.Text>New Post:</Form.Text>

      {
        // Text input for user.
      }
      <Form.Group className="mb-0" controlId="textbox">
        <Form.Control
          as="textarea"
          placeholder=""
          name="textbox"
          value={textbox}
          onChange={handleChange}
        />
        <Form.Text>Max length 400 characters. ({charCount}/400)</Form.Text>
      </Form.Group>

      {
        // Error messages not connected content field
        errors.content?.map((message, idx) => (
          <Alert key={idx} variant="warning" className="mt-3">
            {message}
          </Alert>
        ))
      }

      {
        // Only show if image has been selected by the user
        imagePath && (
          <Form.Group>
            <figure className="d-flex justify-content-center mt-1 mb-0">
              <Image src={imagePath} fluid />
            </figure>
          </Form.Group>
        )
      }

      {
        // Image input for user.
      }
      <InputGroup className="mb-3">
        <Form.Control
          type="file"
          id="image-upload"
          ref={imageFile}
          accept="image/*"
          onChange={(e) => {
            setFormData({
              imagePath: URL.createObjectURL(e.target.files[0]),
              textbox: textbox,
            });
          }}
          style={{ display: 'none' }}
        />
      </InputGroup>
      <div className={`d-flex justify-content-between`}>
        {
          // Button to add an image.
        }
        <Button
          variant="primary"
          onClick={() => document.getElementById('image-upload').click()}
        >
          Choose File
        </Button>

        {
          // Button to remove image.
          imagePath && (
            <Button variant="warning" type="button" onClick={handleRemoveImage}>
              Remove image
            </Button>
          )
        }

        {
          // Submit post button.
        }
        <Button variant="primary" type="submit">
          Post
        </Button>
      </div>

      {
        // Error messages not connected image field.
        errors.image?.map((m, idx) => (
          <Alert variant="warning" key={idx}>
            {m}
          </Alert>
        ))
      }

      {
        // Error messages not connected to any of the input fields.
        errors.non_field_errors?.map((message, idx) => (
          <Alert key={idx} variant="warning" className="mt-3">
            {message}
          </Alert>
        ))
      }

      {
        // Success messages received from API.
        success.success?.map((message, idx) => (
          <Alert key={idx} variant="success" className="mt-3">
            {message}
          </Alert>
        ))
      }
    </Form>
  );

  // Render, show spinner until form loaded.
  return <div>{hasLoaded ? newPostForm : <LoadSpinner />}</div>;
};

export default NewPost;
