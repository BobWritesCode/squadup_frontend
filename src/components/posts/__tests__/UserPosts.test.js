/* global describe it expect*/
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserPosts from '../UserPosts';
import { act } from 'react-dom/test-utils';

describe('UserPosts component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <UserPosts profileId={9} />
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
