import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosDefaultsBaseUrl } from '../../api/axiosDefaults';
// React BootStrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
// css
import styles from '../../styles/SignUpForm.module.css';
import btnStyles from '../../styles/Buttons.module.css';
import LoadSpinner from '../../components/Spinner';

const SignUpForm = () => {
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const { username, email, password1, password2 } = signUpData;
  const [showSpinner, setShowSpinner] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Allow user to edit form.
  const handleChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    const apiData = new FormData();
    apiData.append('username', username);
    apiData.append('email', email);
    apiData.append('password1', password1);
    apiData.append('password2', password2);
    try {
      await axios.post(
        `${axiosDefaultsBaseUrl}dj-rest-auth/registration/`,
        apiData,
      );
      navigate('/signin');
    } catch (err) {
      setErrors(err.response?.data);
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <>
      <Container fluid className={styles}>
        <Row className="justify-content-center">
          <Col xs="12" sm="10" md="8" lg="6" className="d-flex flex-column">
            <h2>Registration</h2>
            <Form className={styles.Form} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter desired username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </Form.Group>

              {errors.username?.map((m, idx) => (
                <Alert variant="warning" key={idx}>
                  {m}
                </Alert>
              ))}

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email address"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              {errors.email?.map((m, idx) => (
                <Alert variant="warning" key={idx}>
                  {m}
                </Alert>
              ))}

              <Form.Group className="mb-3" controlId="password1">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password1"
                  value={password1}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </Form.Group>

              {errors.password1?.map((m, idx) => (
                <Alert variant="warning" key={idx}>
                  {m}
                </Alert>
              ))}

              <Form.Group className="mb-3" controlId="password2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Retype Password"
                  name="password2"
                  value={password2}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </Form.Group>

              {errors.password2?.map((m, idx) => (
                <Alert variant="warning" key={idx}>
                  {m}
                </Alert>
              ))}
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}
              <div className="d-flex flex-row-reverse">
                {showSpinner ? (
                  <LoadSpinner />
                ) : (
                  <>
                    <Button type="submit" className={btnStyles.Register}>
                      Register Account
                    </Button>
                  </>
                )}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUpForm;
