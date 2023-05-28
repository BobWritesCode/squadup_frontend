import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from '../HomePage';

describe('HomePage component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <HomePage />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
    expect(true).toEqual(true);
  });
});
