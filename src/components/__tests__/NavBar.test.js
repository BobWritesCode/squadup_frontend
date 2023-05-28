import { render, screen, waitFor } from '@testing-library/react';
import NavBar from '../NavBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserProvider } from '../../contexts/CurrentUserContext';
import { act } from 'react-dom/test-utils';

describe('Test NavBar rendering for non-logged in user', () => {
  const nonLoggedInUser = () =>
    render(
      <Router>
        <NavBar />
      </Router>,
    );

  it('tests for Home link', () => {
    nonLoggedInUser();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it('tests for Sign In link', () => {
    nonLoggedInUser();
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('tests for Sign Up link', () => {
    nonLoggedInUser();
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('tests no Sign Out link', () => {
    nonLoggedInUser();
    expect(
      screen.queryByRole('link', { name: 'Sign Out' }),
    ).not.toBeInTheDocument();
  });

  it('tests no Squad Finder link', () => {
    nonLoggedInUser();
    expect(
      screen.queryByRole('link', { name: 'Squad Finder' }),
    ).not.toBeInTheDocument();
  });
});

describe('Test NavBar rendering for logged in user', () => {
  const loggedInUser = () =>
    render(
      <Router>
        <CurrentUserProvider>
          <NavBar />
        </CurrentUserProvider>
      </Router>,
    );

  it('tests for Squad Finder', async () => {
    loggedInUser();
    const link = await screen.findByRole('link', { name: 'Squad Finder' });
    expect(link).toBeInTheDocument();
  });

  it('tests for Sign Out', async () => {
    loggedInUser();
    const link = await screen.findByRole('link', { name: 'Sign Out' });
    expect(link).toBeInTheDocument();
  });

  it('tests for no Sign In link', async () => {
    loggedInUser();
    await waitFor(() => {
      const link = screen.queryByRole('link', { name: 'Sign In' });
      expect(link).not.toBeInTheDocument();
    });
  });

  it('tests for no Sign Up link', async () => {
    loggedInUser();
    await waitFor(() => {
      const link = screen.queryByRole('link', { name: 'no Sign Up' });
      expect(link).not.toBeInTheDocument();
    });
  });

  it('tests signing out via Sign Out in NavBar', async () => {
    loggedInUser();

    const link = await screen.findByRole('link', { name: 'Sign Out' });

    await act(async () => {
      link.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const signInLink = await screen.findByRole('link', { name: 'Sign In' });
    const signUpLink = await screen.findByRole('link', { name: 'Sign Up' });

    expect(signInLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
  });
});
