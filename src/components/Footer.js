import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import footerStyles from '../styles/Footer.module.css';
import logo from '../assets/logo-white-text-grey-bg.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Set the current year, so it is automatically updated.
  const Year = new Date().getFullYear();

  const Socials = (
    <>
      <div className={'d-flex flex-row'}>
        <a
          href="https://github.com/BobWritesCode"
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-github"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/warwickhart/"
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-linkedin"></i>
        </a>
      </div>
    </>
  );

  return (
    <>
      <Container fluid className={footerStyles.Main}>
        <Row className={'justify-content-center'}>
          <Col xs="11" className={'d-flex flex-column align-items-center'}>
            <p className="mt-2 mb-1">Why not connect with us?</p>
            {Socials}
            <Link to={'/'}>
              <img
                src={logo}
                alt="Squad Up logo"
                width={'75px'}
                className="mt-2 mb-1"
              />
            </Link>

            <p>Squad up &copy; {Year}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Footer;
