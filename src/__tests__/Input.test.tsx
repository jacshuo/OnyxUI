import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../components/Input';

describe('Input', () => {
  it('renders a plain input when no prefix/suffix/action', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('renders input element with correct type', () => {
    render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
  });

  it('triggers onChange on typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} placeholder="test" />);
    await user.type(screen.getByPlaceholderText('test'), 'abc');
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('renders prefix slot', () => {
    render(<Input prefix={<span data-testid="prefix">$</span>} placeholder="Amount" />);
    expect(screen.getByTestId('prefix')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
  });

  it('renders suffix slot', () => {
    render(<Input suffix={<span data-testid="suffix">.com</span>} placeholder="Domain" />);
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });

  it('renders action button when action prop provided', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Input
        action={{ icon: <span>🔍</span>, onClick, 'aria-label': 'Search' }}
        placeholder="Search"
      />,
    );
    const actionBtn = screen.getByRole('button', { name: 'Search' });
    expect(actionBtn).toBeInTheDocument();
    await user.click(actionBtn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies error state styling', () => {
    const { container } = render(<Input state="error" />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('danger');
  });

  it('applies custom className', () => {
    const { container } = render(<Input className="w-full" />);
    expect(container.firstChild).toHaveClass('w-full');
  });
});
