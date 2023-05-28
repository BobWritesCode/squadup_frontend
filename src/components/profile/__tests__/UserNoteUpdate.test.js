import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserNoteUpdate from '../UserNoteUpdate';
import { act } from 'react-dom/test-utils';

describe('UserNoteUpdate component test', () => {
  const userNote = {
    content: 'fake test content',
  };
  const renderComponent = () =>
    render(
      <Router>
        <UserNoteUpdate userNote={userNote} onUserNoteChange={() => {}} />
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
