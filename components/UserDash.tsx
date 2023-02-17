import { useState, useEffect } from 'react';
import { useSupabaseClient, User } from '@supabase/auth-helpers-react';
import { Database } from '@/utils/database.types';
import Avatar from '@/components/Avatar';
type Profiles = Database['public']['Tables']['profiles']['Row'];

export default function UserDash({ user } : {user: User}) {
    const supabase = useSupabaseClient<Database>();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<Profiles['username']>(null);
    const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        getUserDetails();
    }, []);

    async function getUserDetails() {
        try{
            setLoading(true);
            if (!user) throw new Error('No user');
            let {data, error, status} = await supabase
                .from('profiles')
                .select('username, birthday, first_name, last_name, avatar_url')
                .eq('id', user.id)
                .single();
            if(error && status !== 406) {
                throw error;
            }
            if(data) {
                setUsername(data.username);
                setAvatarUrl(data.avatar_url);
            }
        } catch(exception) {
            // alert('Error loading user details');
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile({username, avatar_url} : {username: Profiles['username'], avatar_url: Profiles['avatar_url']}) {
        try {
            setLoading(true);
            if(!user) throw new Error('no user');
            const updates = {
                id: user.id,
                username,
                avatar_url,
                updated_at: new Date().toISOString()
            }
            let { error } = await supabase.from('profiles').upsert(updates);
            if(error) throw error;
        } catch (exception) {
            console.log(`updating profile failed: ${JSON.stringify(exception, null, 2)}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="">
            <div className='flex flex-col justify-center items-center'>
                <p>
                    {!loading ? `signed in as ${username}` : "Loading..."}
                </p>
                <Avatar onClick={() => setShowOptions(old => !old)} uid={user.id} url={avatar_url} size={150} onUpload={(url) => {
                    setAvatarUrl(url);
                    updateProfile({username, avatar_url: url})}
                }/>
                {showOptions && (
                    <div className="w-[200px] rounded-lg">
                        <div className='odd:bg-slate-200 even:bg-slate-100'>
                            <p>Manage your account</p>
                        </div>
                        <div className='odd:bg-slate-200 even:bg-slate-100'>
                            <p>Your Events</p>
                        </div>
                        <div className='odd:bg-slate-200 even:bg-slate-100'>
                            <p>Friends</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}