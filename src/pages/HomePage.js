import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from '../assets/logo-white-text-grey-bg.png';
import btnStyles from '../styles/Buttons.module.css';
import listStyles from '../styles/Lists.module.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext';

const HomePage = () => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  /**
   * JSX to show buttons.
   * Which buttons shown will depend if user is currently logged in.
   */
  const ShowButtons = !currentUser ? (
    <>
      <Button
        variant="light"
        className={`${btnStyles.Single} w-100`}
        onClick={() => {
          navigate('/signin');
        }}
      >
        Sign In
      </Button>
      <Button
        variant="light"
        className={`${btnStyles.Single} w-100 mt-3 mt-sm-0 ms-sm-4`}
        onClick={() => {
          navigate('/signup');
        }}
      >
        Sign Up
      </Button>
    </>
  ) : (
    <>
      {' '}
      <Button
        variant="light"
        className={`${btnStyles.Single} w-100`}
        onClick={() => {
          navigate('/lfg');
        }}
      >
        Squad Finder
      </Button>
      <Button
        variant="light"
        className={`${btnStyles.Single} w-100 mt-3 mt-sm-0 ms-sm-4`}
        onClick={() => {
          navigate(`/profile/${currentUser.pk}`);
        }}
      >
        My Profile
      </Button>
    </>
  );

  return (
    <>
      <Row className="justify-content-center">
        <Col className="d-flex flex-column">
          <img
            src={logo}
            alt="Squad Up logo"
            className="mx-auto mb-3"
            style={{ maxWidth: '100%', maxHeight: '500px' }}
          />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="d-flex flex-column align-items-center text-center">
          <h1>SQUAD UP</h1>
          <h3>FIND YOUR NEXT TEAM!</h3>
          <p className={'mb-4'}>
            A site to promote your team or find one to join.
          </p>
          <p style={{ fontWeight: '600', textDecoration: 'underline' }}>
            What can you expect to find here:
          </p>
          <ul className={`${listStyles.List} list-group mb-4`}>
            <li className="list-group-item">
              Find a team{' '}
              <span>
                that requires your skill set by filtering out all the ones that
                don&apos;t.
              </span>
            </li>
            <li className="list-group-item">
              Promote your team{' '}
              <span>
                by specifying the level and role of players that match your
                requirements
              </span>
            </li>
            <li className="list-group-item">
              Promote yourself{' '}
              <span>
                by posting your achievements on your own profile timeline.
              </span>
            </li>
          </ul>
          <h3 className={'mb-3 mt-0'}>Quick links:</h3>
          <div className="d-flex flex-column justify-content-center flex-sm-row w-75 align-items-center w-sm-75 w-md-50">
            {ShowButtons}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default HomePage;
