/* global describe it expect*/
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import PostEdit from '../PostEdit';
import { act } from 'react-dom/test-utils';

describe('PostEdit component test', () => {
  // Mock data
  const post = {
    id: 1,
    content: 'content',
    image: '',
  };
  const renderComponent = () =>
    render(
      <Router>
        <PostEdit post={post} onEditPost={() => {}} />
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
