import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NewPost from '../NewPost';
import { act } from 'react-dom/test-utils';

describe('NewPost component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <NewPost />
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
