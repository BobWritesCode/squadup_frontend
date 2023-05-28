import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Avatar from '../Avatar';

describe('Avatar component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <Avatar />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
  });
});
