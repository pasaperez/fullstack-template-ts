import { TextField } from '@shared/ui/TextField';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TextField', () => {
    it('renders inputs with and without validation errors', () => {
        const { rerender } = render(<TextField id='name' label='Name' name='name' />);

        expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'false');
        expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-describedby');
        expect(screen.queryByText('Name is required.')).not.toBeInTheDocument();

        rerender(<TextField error='Name is required.' id='name' label='Name' name='name' />);

        expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByLabelText('Name')).toHaveAttribute('aria-describedby', 'name-error');
        expect(screen.getByText('Name is required.')).toBeInTheDocument();
    });
});
