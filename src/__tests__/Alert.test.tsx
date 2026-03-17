import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '../components/Alert';

describe('Alert (static)', () => {
  it('renders with role="alert"', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Alert>Important message</Alert>);
    expect(screen.getByText('Important message')).toBeInTheDocument();
  });

  it('applies intent variant', () => {
    const { container } = render(<Alert intent="error">Oops</Alert>);
    expect(container.firstChild).toHaveClass('border-danger-200');
  });

  it('merges custom className', () => {
    render(<Alert className="my-alert" data-testid="a">X</Alert>);
    expect(screen.getByTestId('a')).toHaveClass('my-alert');
  });
});

describe('AlertTitle', () => {
  it('renders as h5', () => {
    render(<AlertTitle>Title</AlertTitle>);
    const el = screen.getByText('Title');
    expect(el.tagName).toBe('H5');
  });
});

describe('AlertDescription', () => {
  it('renders as p', () => {
    render(<AlertDescription>Description text</AlertDescription>);
    const el = screen.getByText('Description text');
    expect(el.tagName).toBe('P');
  });
});

describe('Alert composition', () => {
  it('renders title and description together', () => {
    render(
      <Alert intent="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
  });
});
