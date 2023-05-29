/* global describe it expect*/
import { render } from '@testing-library/react';
import React from 'react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

describe('App component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <App />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
    expect(true).toEqual(true);
  });
});
