import UserDash from '@/components/UserDash'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const buttonStyle = "rounded-full bg-lime-500 px-2 hover:bg-lime-600";

export default function Home() {
    const user = useUser();
    const supabase = useSupabaseClient();
    const router = useRouter();

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if(error){
          console.log("error logging out");
        } else {
            router.push('/')
        }
    }

    return(
        <div>
            {user && <UserDash user={user}/>}
            <button onClick={handleLogout} className={buttonStyle}>Sign out</button>
        </div>
    )
}