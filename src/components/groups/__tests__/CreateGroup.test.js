/* global describe it */
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CreateGroup from '../CreateGroup';

describe('CreateGroup component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <CreateGroup />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
  });
});
