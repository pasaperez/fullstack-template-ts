'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';

interface GlobalErrorProps {
    readonly error: Error;
    readonly reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps): ReactElement {
    return (
        <section aria-labelledby='global-error-title' className='status-page'>
            <div className='status-page__surface'>
                <p className='status-page__eyebrow'>Error</p>
                <h1 id='global-error-title'>Unexpected runtime error</h1>
                <p className='status-page__message'>
                    The current screen could not be rendered. Try again or return to the users workspace.
                </p>
                <div className='status-page__actions'>
                    <button className='button' onClick={reset} type='button'>Try again</button>
                    <Link className='button button--ghost' href='/users'>Go to users</Link>
                </div>
            </div>
        </section>
    );
}
