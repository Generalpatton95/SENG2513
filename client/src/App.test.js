import { render, screen } from '@testing-library/react';
import App from './App';


test('renders home link', () => {
  render(<App />);
  const linkElement = screen.getByText(/home/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders about link', () => {
  render(<App />);
  const linkElement = screen.getByText(/about/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders contact link', () => {
  render(<App />);
  const linkElement = screen.getByText(/contact/i);
  expect(linkElement).toBeInTheDocument();
});
