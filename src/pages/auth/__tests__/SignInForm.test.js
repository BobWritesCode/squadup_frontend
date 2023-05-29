/* global describe it expect jest*/
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignInForm from '../SignInForm';

// Mock the styles import
jest.mock('../../styles/SignUpForm.module.css', () => ({}));

describe('SignInForm component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <SignInForm />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
    expect(true).toEqual(true);
  });
});
