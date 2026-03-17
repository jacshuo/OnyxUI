import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../components/Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders as a span', () => {
    const { container } = render(<Badge>Tag</Badge>);
    expect(container.querySelector('span')).toBeTruthy();
  });

  it('applies intent variant', () => {
    const { container } = render(<Badge intent="success">OK</Badge>);
    expect(container.firstChild).toHaveClass('bg-success-100');
  });

  it('applies default intent when none specified', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass('bg-secondary-100');
  });

  it('merges custom className', () => {
    const { container } = render(<Badge className="mx-2">X</Badge>);
    expect(container.firstChild).toHaveClass('mx-2');
  });

  it('passes HTML attributes', () => {
    render(<Badge data-testid="badge" title="info">I</Badge>);
    expect(screen.getByTestId('badge')).toHaveAttribute('title', 'info');
  });
});
