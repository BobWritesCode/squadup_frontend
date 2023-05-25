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

/**
 * Navigation bar component.
 * @return {JSX} Renders component.
 */
const NavBar = () => {
  // Get current user.
  const currentUser = useCurrentUser();
  // Set current user. Used here during click on logout.
  const setCurrentUser = useSetCurrentUser();
  // Use to set NavBar open or closed for mobile view.
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  /**
   * Calls API to sign out current user..
   */
  const handleSignOut = async () => {
    try {
      await axios.post(`${axiosDefaultsBaseUrl}dj-rest-auth/logout/`);
      // Clear user information from local storage.
      setCurrentUser(null);
      // Remove token of logged in user.
      removeTokenTimestamp();
    } catch (err) {
      // Show errors in console.
      console.log(err);
    }
  };

  /**
   * JSX of Home link.
   */
  const homeLink = (
    <NavLink to="/" className={(el) => (el.isActive ? styles.active : '')}>
      Home
    </NavLink>
  );

  /**
   * JSX of sign in link.
   */
  const signInLink = (
    <NavLink
      to="/signin"
      className={(el) => (el.isActive ? styles.active : '')}
    >
      Sign In
    </NavLink>
  );

  /**
   * JSX of registration link.
   */
  const signUpLink = (
    <NavLink
      to="/signup"
      className={(el) => (el.isActive ? styles.active : '')}
    >
      Sign up
    </NavLink>
  );

  /**
   * JSX of log out link.
   */
  const logoutLink = (
    <>
      <NavLink to="/" onClick={handleSignOut}>
        Sign Out
      </NavLink>
    </>
  );

  /**
   * JSX of squad finder link.
   */
  const lfgLink = (
    <>
      <NavLink to="/lfg" className={(el) => (el.isActive ? styles.active : '')}>
        Squad Finder
      </NavLink>
    </>
  );

  /**
   * JSX of profile link.
   */
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

  /**
   * Return JSX of component.
   */
  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container fluid>
        {/* Brand logo */}
        <Navbar.Brand>
          <img src={logo} alt="Squad Up logo" height="45" />
        </Navbar.Brand>
        {/* Controls if nav is expanded or close for mobile */}
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
            {/* Links to show depending in user is logged in or not */}
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
