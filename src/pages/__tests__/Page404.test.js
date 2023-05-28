import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Page404 from '../Page404';

describe('Page404 component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <Page404 />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
    expect(true).toEqual(true);
  });
});
