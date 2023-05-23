import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// React BootStrap imports
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
// app imports
import { setTokenTimestamp } from '../../utils/utils';
import { axiosDefaultsBaseUrl } from '../../api/axiosDefaults';
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';
// css imports
import appStyles from '../../App.module.css';
import styles from '../../styles/SignUpForm.module.css';
import btnStyles from '../../styles/Buttons.module.css';
import LoadSpinner from '../../components/Spinner';

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();

  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = signInData;

  const [errors, setErrors] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowSpinner(true);
    try {
      const { data } = await axios.post(
        `${axiosDefaultsBaseUrl}dj-rest-auth/login/`,
        signInData,
      );
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      navigate(`/profile/${data.user.pk}`);
    } catch (err) {
      setErrors(err.response?.data);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Container fluid className={styles}>
      <Row className="justify-content-center">
        <Col xs="12" sm="10" md="8" lg="6" className="d-flex flex-column">
          <h2 className={appStyles.PageHeader}>Sign In</h2>

          <Form onSubmit={handleSubmit} className={styles.Form}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                className={styles.Input}
                value={username}
                onChange={handleChange}
                autoComplete="username"
              />
            </Form.Group>

            {errors.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                className={styles.Input}
                value={password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </Form.Group>

            {errors.password?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <div className="d-flex flex-row-reverse">
              {showSpinner ? (
                <LoadSpinner />
              ) : (
                <>
                  <Button type="submit" className={btnStyles.Register}>
                    Sign In
                  </Button>
                </>
              )}
            </div>

            <Link className={styles.Link} to="/signup">
              Don't have an account? <span>Sign up now!</span>
            </Link>

            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignInForm;
