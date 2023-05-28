import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import GroupSlot from '../GroupSlot';
import { act } from 'react-dom/test-utils';

describe('GroupSlot component test', () => {
  // Prepare mock prop data
  const slotData = {
    status: 'Open',
  };

  const renderComponent = () =>
    render(
      <Router>
        <table>
          <tbody>
            <GroupSlot slotData={slotData} />
          </tbody>
        </table>
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
