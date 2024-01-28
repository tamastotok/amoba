import { render, screen, waitFor } from '@testing-library/react';
import MessageBoard from './MessageBoard';
import { Provider } from 'react-redux';
import store from '../../store';
import '@testing-library/jest-dom';

describe('Message component', () => {
  it('renders the userOnline count correctly', async () => {
    const onlineUserCount = 42; // Set the onlineUserCount value for testing

    render(
      <Provider store={store}>
        <MessageBoard onlineUserCount={onlineUserCount} />
      </Provider>
    );

    // Assert that the rendered component contains the expected userOnline count
    await waitFor(() => {
      const userOnlineElement = screen.getByText(onlineUserCount.toString());
      expect(userOnlineElement).toBeInTheDocument();
    });
  });
});
