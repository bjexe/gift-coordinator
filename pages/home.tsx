import UserDash from '@/components/UserDash';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { buttonStyle } from "@/styles/buttonsClasses";
import { formFieldStyle, inputStyle} from "@/styles/formClasses";

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
        <div className="flex justify-center flex-col">
            {user && <UserDash user={user}/>}
            <div>
                <button onClick={handleLogout} className={`${buttonStyle}`}>Sign out</button>
            </div>
            <div>
                <h1 className="font-inter">Whereas recognition of the inherent dignity</h1>
            </div>
        </div>
    );
}