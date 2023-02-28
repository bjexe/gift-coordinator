import React from 'react';
import { useRouter } from 'next/router';

export default function Event() {
    const router = useRouter();
    const { id } = router.query;
    
    return (
        <div>
            <div>
                <h1>
                    // event title
                </h1>
                <div>
                    // event details and interactivity
                </div>
            </div>
        </div>
    );
}