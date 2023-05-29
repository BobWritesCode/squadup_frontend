/* global describe it expect*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Check Footer rendering', () => {
  const footerRender = () =>
    render(
      <Router>
        <Footer />
      </Router>,
    );

  it('checks social links show', () => {
    footerRender();
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute(
      'href',
      'https://github.com/BobWritesCode',
    );
    expect(links[1]).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/warwickhart/',
    );
  });
});
