import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Chat from './Chat';
import socket from '../../server';

// Mock the react-redux and react-router-dom dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

// Mock the socket.io module
jest.mock('../../server', () => ({
  on: jest.fn(),
  emit: jest.fn(),
}));

describe('Chat component', () => {
  it('renders without crashing', () => {
    render(<Chat />);
  });

  it('sends a message when the "Enter" key is pressed', () => {
    const { getByRole } = render(<Chat />);

    // Mock the value of the text input
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const input = getByRole('textbox') as HTMLInputElement;
    input.value = 'Test message';

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Assert that the socket.emit function was called
    expect(socket.emit).toHaveBeenCalledWith('send-message', expect.any(Object));
  });

  it('sends a message when the "Send" button is clicked', () => {
    const { getByText, getByRole } = render(<Chat />);

    // Mock the value of the text input
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const input = getByRole('textbox') as HTMLInputElement;
    input.value = 'Test message';

    // Click the "Send" button
    // eslint-disable-next-line testing-library/prefer-screen-queries
    fireEvent.click(getByText('Send'));

    // Assert that the socket.emit function was called
    expect(socket.emit).toHaveBeenCalledWith('send-message', expect.any(Object));
  });
});
