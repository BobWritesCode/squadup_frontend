/* global describe it expect*/
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Post from '../Post';
import { act } from 'react-dom/test-utils';

describe('Post component test', () => {
  // Mock data
  const id = 1;
  const created_at = Date.now();
  const updated_at = Date.now();
  const content = 'content';
  const image = '';

  const renderComponent = () =>
    render(
      <Router>
        <Post
          id={id}
          created_at={created_at}
          updated_at={updated_at}
          content={content}
          image={image}
        />
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
