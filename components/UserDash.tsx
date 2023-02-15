import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient, User } from '@supabase/auth-helpers-react';
import { Database } from '@/utils/database.types';
import { setDefaultResultOrder } from 'dns';
type Profiles = Database['public']['Tables']['profiles']['Row'];

export default function UserDash({ user } : {user: User}) {
    const supabase = useSupabaseClient<Database>();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<Profiles['username']>(null);

    useEffect(() => {
        getUserDetails();
    }, []);

    async function getUserDetails() {
        try{
            setLoading(true);
            if (!user) throw new Error('No user');
            let {data, error, status} = await supabase
                .from('profiles')
                .select('username, birthday, first_name, last_name')
                .eq('id', user.id)
                .single();
            if(error && status !== 406) {
                throw error;
            }
            if(data) {
                setUsername(data.username);
            }
        } catch(exception) {
            // alert('Error loading user details');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <p>
                {loading ? `${username}` : "Loading..."}
            </p>
        </div>
    );
}