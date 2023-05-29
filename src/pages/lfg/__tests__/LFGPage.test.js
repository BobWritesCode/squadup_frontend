/* global describe it expect*/
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LFGPage from '../LFGPage';
import { CurrentUserProvider } from '../../../contexts/CurrentUserContext';
import { act } from 'react-dom/test-utils';

describe('LFGPage component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <CurrentUserProvider>
          <LFGPage />
        </CurrentUserProvider>
      </Router>,
    );

  it('renders the component', async () => {
    // Mock Params to use.

    renderComponent();
    // This act makes sure that the render is completed because of any state changes after useEffect() API is resolved.
    await act(async () => {
      expect(true).toEqual(true);
    });
  });
});
