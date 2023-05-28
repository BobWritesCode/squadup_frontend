import React from 'react';
import { render } from '@testing-library/react';
import LoadSpinner from '../Spinner';
import { BrowserRouter as Router } from 'react-router-dom';

describe('LoadSpinner', () => {
  const renderComponent = () =>
    render(
      <Router>
        <LoadSpinner />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
  });
});
