import UserDash from '@/components/UserDash';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { buttonStyle } from "@/styles/buttonsClasses";
import { formFieldStyle, inputStyle} from "@/styles/formClasses";
import Avatar from '@/components/Avatar';

export default function Home() {
    const user = useUser();
    const supabase = useSupabaseClient();
    const router = useRouter();

    useEffect(() => {
        if(!user) {
            router.push('/');
        }
    }, [user]);

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if(error){
          console.log("error logging out");
        } else {
            router.push('/');
        }
    }

    return(
        <div>
            {user && <UserDash user={user}/>}
            <button onClick={handleLogout} className={buttonStyle}>Sign out</button>
        </div>
    );
}