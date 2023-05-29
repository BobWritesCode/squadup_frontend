import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import UsernameUpdate from '../UsernameUpdate';
import { CurrentUserProvider } from '../../../contexts/CurrentUserContext';

describe('UsernameUpdate component test', () => {
  const renderComponent = () => render(
    <Router>
      <CurrentUserProvider
        value={{ currentUser: { username: 'mockUsername' } }}
      >
        <UsernameUpdate onUsernameChange={() => {}} />
      </CurrentUserProvider>
    </Router>,
  );

  it('renders the component', async () => {
    renderComponent();
    // This act makes sure that the render is completed because of any state changes after useEffect() API is resolved.
    await act(async () => {
      expect(true).toEqual(true);
    });
  });
});
