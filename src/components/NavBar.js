import React from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo-white-text-grey-bg.png';
import styles from '../styles/NavBar.module.css';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../contexts/CurrentUserContext';
import axios from 'axios';
import { removeTokenTimestamp } from '../utils/utils';
import { axiosDefaultsBaseUrl } from '../api/axiosDefaults';

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const handleSignOut = async () => {
    try {
      await axios.post(`${axiosDefaultsBaseUrl}dj-rest-auth/logout/`);
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (err) {
      console.log(err);
    }
  };

  const homeLink = (
    <NavLink to="/" className={(el) => (el.isActive ? styles.active : '')}>
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

  const logoutLink = (
    <>
      <NavLink
        to="/"
        onClick={handleSignOut}>
        Sign Out
      </NavLink>
      {currentUser?.username}
    </>
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
            {currentUser ? logoutLink : signInLink}
            {currentUser ? '' : signUpLink }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
