/* global describe it expect jest*/
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignUpForm from '../SignUpForm';

// Mock the styles import
jest.mock('../../styles/SignUpForm.module.css', () => ({}));

describe('SignUpForm component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <SignUpForm />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
    expect(true).toEqual(true);
  });
});
