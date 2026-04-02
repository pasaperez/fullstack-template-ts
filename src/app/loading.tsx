import type { ReactElement } from 'react';

export default function Loading(): ReactElement {
    return (
        <section aria-live='polite' className='status-page' role='status'>
            <div className='status-page__surface'>
                <p className='status-page__eyebrow'>Loading</p>
                <h1>Preparing the users workspace</h1>
                <p className='status-page__message'>The current users page is loading.</p>
            </div>
        </section>
    );
}
