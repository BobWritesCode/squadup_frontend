import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import btnStyles from '../../styles/Buttons.module.css';
import styles from '../../styles/Profile.module.css';
import Avatar from '../Avatar';
import { Image } from 'react-bootstrap';
import { axiosReq } from '../../contexts/CurrentUserContext';
import modalStyles from '../../styles/Modal.module.css';
import formStyles from '../../styles/Forms.module.css';
import LoadSpinner from '../Spinner';
import PropTypes from 'prop-types';

const AvatarUpdate = (props) => {
  const { onAvatarChange, avatar } = props;
  const avatarFile = useRef();
  const [myAvatar, setMyAvatar] = useState(avatar);
  const [imageFile, setImageFile] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  // Modal functions
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setErrors({});
    setShow(false);
  };
  const handleShow = () => {
    setImageFile('');
    setShow(true);
  };

  // get current user id
  const { id } = useParams();

  // set up variables for errors from request.
  const [errors, setErrors] = useState({});

  // Handle submit on button press
  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowSpinner(true);
    setErrors({});
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const { data } = await axiosReq.patch(`/profiles/${id}/`, formData);
      // update the image in parent component.
      onAvatarChange(data.post.image);
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
        <div className={styles.AvatarContainer}>
          <Avatar src={avatar} text="" width={'100%'} />
          <div className={styles.AvatarHover}>
            <div className={styles.AvatarText}>
              <i className="bi bi-pencil-square text-dark"></i>
            </div>
          </div>
        </div>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className={modalStyles.Header}>
          <Modal.Title>Update avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyles.Body}>
          <Form
            className={formStyles.Form}
            onSubmit={handleSubmit}
          >
            <Form.Group>
              {avatar && (
                <figure className="d-flex justify-content-center">
                  <Image src={myAvatar} fluid />
                </figure>
              )}
              <div className="d-flex justify-content-center">
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Single} btn my-auto`}
                  htmlFor="avatar-upload"
                >
                  Change the image
                </Form.Label>
              </div>

              <Form.Control
                className="d-none"
                type="file"
                id="avatar-upload"
                ref={avatarFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setMyAvatar(URL.createObjectURL(e.target.files[0]));
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
            </Form.Group>

            {errors.image?.map((m, idx) => (
              <Alert variant="warning" key={idx} className="mt-3 mb-0">
                {m}
              </Alert>
            ))}

            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3  mb-0">
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
AvatarUpdate.propTypes = {
  avatar: PropTypes.string.isRequired,
  onAvatarChange: PropTypes.func.isRequired,
};

export default AvatarUpdate;
