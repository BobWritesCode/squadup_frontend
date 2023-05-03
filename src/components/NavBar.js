import React from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo-white-text-grey-bg.png';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const homeLink = (
    <NavLink
      to="/"
      className={(el) => (el.isActive ? styles.active : '')}
    >
      Home
    </NavLink>
  );

  const signInLink = (
    <NavLink
      to="/signin"
      className={(el) => (el.isActive ? styles.active : '')}
    >
      Sign In
    </NavLink>
  );

  const signUpLink = (
    <NavLink
      to="/signup"
      className={(el) => (el.isActive ? styles.active : '')}
    >
      Sign up
    </NavLink>
  );

  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container fluid>
        <Navbar.Brand>
          <img src={logo} alt="Squad Up logo" height="45" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="justify-content-end flex-grow-1 pe-3"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            {homeLink}
            {signInLink}
            {signUpLink}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
