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
import useClickOutsideToggle from './hooks/useClickOutsideToggle';

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

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
      <NavLink to="/" onClick={handleSignOut}>
        Sign Out
      </NavLink>
    </>
  );

  const lfgLink = (
    <>
      <NavLink to="/lfg" className={(el) => (el.isActive ? styles.active : '')}>
        Squad Finder
      </NavLink>
    </>
  );

  const profileLink = (
    <>
      <NavLink
        to={`/profile/${currentUser?.profile_id}`}
        className={(el) => (el.isActive ? styles.active : '')}
        onClick={() => {}}
      >
        Profile
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container fluid>
        <Navbar.Brand>
          <img src={logo} alt="Squad Up logo" height="45" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarScroll"
          ref={ref}
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="justify-content-end flex-grow-1 pe-3"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            {homeLink}
            {currentUser ? '' : signInLink}
            {currentUser ? '' : signUpLink}
            {currentUser ? lfgLink : ''}
            {currentUser ? profileLink : ''}
            {currentUser ? logoutLink : ''}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
