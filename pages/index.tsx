import Head from "next/head";
import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export default function Index() {
    
    const router = useRouter();
    const session = useSession();

    React.useEffect(() => {
        if(session) {
            router.push('/home', '/');
        } else {
            router.push('/signin', '/');
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>Gift App</title>
                <meta name="description" content="A gift coordinating app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </>
    );
}