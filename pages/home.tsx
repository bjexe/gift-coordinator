import UserDash from '@/components/UserDash';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
    const user = useUser();
    const supabase = useSupabaseClient();
    const router = useRouter();

    useEffect(() => {
        if(!user) {
            router.push('/');
        }
    }, [user]);

    return(
        <div>
            <div className="flex w-full justify-between items-center bg-slate-300">
                <div className='justify-self-start'>
                    <h1 className='font-inter ml-[25px]'>Website Name</h1>
                </div>
                <div className='justify-self-end self-end'>
                    {user && <UserDash user={user}/>}
                </div>
            </div>
        </div>
    );
}