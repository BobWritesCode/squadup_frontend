import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { setTokenTimestamp } from '../../utils/utils';
import { axiosDefaultsBaseUrl } from '../../api/axiosDefaults';
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';
import appStyles from '../../App.module.css';
import styles from '../../styles/SignUpForm.module.css';
import btnStyles from '../../styles/Buttons.module.css';
import LoadSpinner from '../../components/Spinner';

/**
 * Sign in page.
 * @return {JSX} Renders page.
 */
const SignInForm = () => {
  // Set current user on successful authentication.
  const setCurrentUser = useSetCurrentUser();
  // react-router-dom navigation control.
  const navigate = useNavigate();
  // Use to control data for sign in form.
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = signInData;
  // Use to any expected errors as alerts.
  const [errors, setErrors] = useState({});
  // Use to toggle showing spinner while waiting for API to resolve.
  const [showSpinner, setShowSpinner] = useState(false);

  /**
   * Handles submitting form data to api and handling the response.
   * If user is not authenticated, then expected error messages are to be shown.
   * If use is authenticated, then set tokens, and redirect user to profile page.
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Show spinner while API resolves.
    setShowSpinner(true);
    try {
      const { data } = await axios.post(
        `${axiosDefaultsBaseUrl}dj-rest-auth/login/`,
        signInData,
      );
      // If authenticated set user in browser.
      setCurrentUser(data.user);
      // if authenticated save token to browser.
      setTokenTimestamp(data);
      // If authenticated redirect user to their profile page.
      navigate(`/profile/${data.user.pk}`);
    } catch (err) {
      // If not authenticated show expected error messages.
      setErrors(err.response?.data);
    } finally {
      // Remove spinner.
      setShowSpinner(false);
    }
  };

  /**
   * Allow user to edit form.
   * @param {*} e
   */
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Return JSX of component.
   */
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

            {/*Display expected username error messages*/}
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

            {/*Display expected password error messages*/}
            {errors.password?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            {/*Show spinner while waiting for API to resolve*/}
            <div className="d-flex flex-row-reverse mb-3">
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

            <Link className={`${styles.Link}`} to="/signup">
              Don&apos;t have an account? <span>Sign up now!</span>
            </Link>

            {/*Display expected non-field error messages*/}
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
};

export default SignInForm;
