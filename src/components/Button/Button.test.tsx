import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Button from './Button';

describe('Button component', () => {
  test('renders button with text', async () => {
    const linkTo = '/some-path';
    const text = 'Click me';
    const clickEvent = jest.fn();
    const isDisabled = false;

    render(
      <Router>
        <Button
          linkTo={linkTo}
          text={text}
          clickEvent={clickEvent}
          isDisabled={isDisabled}
        />
      </Router>
    );

    const button = screen.getByRole('link', { name: text });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', linkTo);
    expect(button).toHaveTextContent(text);

    // Simulate click
    fireEvent.click(button);

    // Use `await` to wait for asynchronous code in `clickEvent`
    await clickEvent();

    // Assertions after asynchronous code is expected to be completed
    expect(clickEvent).toHaveBeenCalledTimes(1);
  });

  test('renders disabled button', () => {
    const linkTo = '/some-path';
    const text = 'Click me';
    const isDisabled = true;

    render(
      <Router>
        <Button linkTo={linkTo} text={text} isDisabled={isDisabled} />
      </Router>
    );

    const link = screen.getByRole('link', { name: text });
    const button = screen.getByRole('button', { name: text });

    expect(link).toHaveAttribute('href', linkTo);
    expect(button).toHaveTextContent(text);
    expect(button).toHaveClass('Mui-disabled');
    expect(button).toBeDisabled();
  });
});
