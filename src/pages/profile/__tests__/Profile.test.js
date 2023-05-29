/* global describe it expect jest*/

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import Profile from '../Profile';
import { CurrentUserProvider } from '../../../contexts/CurrentUserContext';
import { act } from 'react-dom/test-utils';
import { ProfileDataProvider } from '../../../contexts/ProfileDataContext';

// Mock useParams to provide the id parameter
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('Profile component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <CurrentUserProvider>
          <ProfileDataProvider>
            <Profile />
          </ProfileDataProvider>
        </CurrentUserProvider>
      </Router>,
    );

  it('renders the component', async () => {
    // Mock Params to use.
    useParams.mockReturnValue({ id: '28' });
    renderComponent();
    // This act makes sure that the render is completed because of any state changes after useEffect() API is resolved.
    await act(async () => {
      expect(true).toEqual(true);
    });
  });
});
