import { getErrorMessage } from '@shared/domain/getErrorMessage';
import { describe, expect, it } from 'vitest';

describe('getErrorMessage', () => {
    it('returns the message from an Error instance when it is present', () => {
        expect(getErrorMessage(new Error('Explicit message'), 'Fallback message')).toBe('Explicit message');
    });

    it('falls back when the error is not an Error or the message is empty', () => {
        expect(getErrorMessage(new Error(''), 'Fallback message')).toBe('Fallback message');
        expect(getErrorMessage('unexpected', 'Fallback message')).toBe('Fallback message');
    });
});
