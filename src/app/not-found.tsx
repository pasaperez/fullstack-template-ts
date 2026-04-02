import Link from 'next/link';
import type { ReactElement } from 'react';

export default function NotFound(): ReactElement {
    return (
        <section aria-labelledby='not-found-title' className='status-page'>
            <div className='status-page__surface'>
                <p className='status-page__eyebrow'>404</p>
                <h1 id='not-found-title'>Page not found</h1>
                <p className='status-page__message'>The page you requested does not exist or is no longer available.</p>
                <div className='status-page__actions'>
                    <Link className='button' href='/users'>Go to users</Link>
                </div>
            </div>
        </section>
    );
}
