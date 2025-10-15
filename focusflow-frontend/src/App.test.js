import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders FocusFlow app', () => {
  render(<App />);
  // Basic test to ensure app renders without crashing
  expect(screen.getByText(/FocusFlow/i)).toBeInTheDocument();
});
