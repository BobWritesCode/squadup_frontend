import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ApplicationTable from '../ApplicationTable';

describe('Application Table component test', () => {

  const renderComponent = () =>
    render(
      <Router>
        <ApplicationTable />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
  });
});
