import { render, screen } from '@testing-library/react';
import App from './App';

// Mock fetch to prevent network calls during tests
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/types')) {
      return Promise.resolve({
        json: () => Promise.resolve([]),
      });
    }
    if (url.includes('/stats')) {
      return Promise.resolve({
        json: () => Promise.resolve([]),
      });
    }
    return Promise.resolve({
      json: () => Promise.resolve({ data: [], totalPages: 1, totalCount: 0 }),
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders sensor data dashboard title', async () => {
  render(<App />);
  const titleElement = screen.getByText(/Sensor Data Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders navigation tabs', async () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Dashboard/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Data Table/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Charts/i })).toBeInTheDocument();
});

test('renders dashboard tab by default', async () => {
  render(<App />);
  expect(screen.getByText(/Real-time Sensor Dashboard/i)).toBeInTheDocument();
});
