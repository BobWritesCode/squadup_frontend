import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Group from '../Group';
import { act } from 'react-dom/test-utils';

describe('Group component test', () => {
  // Data for mock api data used in handler.js
  const group = {
    id: 239,
  };

  const renderComponent = () =>
    render(
      <Router>
        <Group group={group} onDelete={() => {}} />
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
