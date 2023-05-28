import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import MyGroups from '../MyGroups';
import { act } from 'react-dom/test-utils';

describe('MyGroups component test', () => {
  const renderComponent = () =>
    render(
      <Router>
        <MyGroups />
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
