import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo-white-text-grey-bg.png';

const NavBar = () => {
  return (
    <Navbar bg="light" expand="md" fixed="top">
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
            <Nav.Link>Home</Nav.Link>
            <Nav.Link>Sign In</Nav.Link>
            <Nav.Link>Sign up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
