/* global describe it */
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ApplicationReviews from '../ApplicationReviews';

describe('Application Reviews component test', () => {
  // ID for mock api data used in handler.js
  const slotData = {
    id: 88,
  };
  const renderComponent = () =>
    render(
      <Router>
        <ApplicationReviews slotData={slotData} />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
  });
});
