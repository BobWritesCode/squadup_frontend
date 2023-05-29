import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import img404 from '../assets/404-sq.png';
import Button from 'react-bootstrap/Button';
import btnStyles from '../styles/Buttons.module.css';
import { useNavigate } from 'react-router-dom';

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <>
      <Row className="justify-content-center">
        <Col className="d-flex flex-column">
          <img
            src={img404}
            alt="Squad Up logo"
            className="mx-auto mb-3"
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          />
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <Col className="d-flex flex-column align-items-center">
          <h1 className="mb-4">How did you even get here?</h1>
          <h3 className="mb-4">Let&apos;s get you home!</h3>
          <Button
            variant="warning"
            type="button"
            onClick={() => {
              navigate('/');
            }}
            className={`${btnStyles.Single} py-3 px-5`}
          >
            Take me there
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Page404;
