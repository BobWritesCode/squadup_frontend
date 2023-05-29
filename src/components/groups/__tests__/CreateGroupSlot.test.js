/* global describe it */
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CreateGroupSlot from '../CreateGroupSlot';

describe('CreateGroupSlot component test', () => {
  // Mock function for onSlotChange
  const HandleOnSlotChange = () => {};

  // Mock data for slotValue
  const slotValue = {
    role: 'Any',
  };

  const renderComponent = () =>
    render(
      <Router>
        <CreateGroupSlot
          onSlotChange={HandleOnSlotChange}
          slotValue={slotValue}
        />
      </Router>,
    );

  it('renders the component', () => {
    renderComponent();
  });
});
