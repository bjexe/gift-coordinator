import { useState, useEffect } from 'react';
import { useSupabaseClient, User } from '@supabase/auth-helpers-react';
import { Database } from '@/utils/database.types';
import Avatar from '@/components/Avatar';
import { useRouter } from 'next/router';
type Profiles = Database['public']['Tables']['profiles']['Row'];

export default function UserDash({ user } : {user: User}) {
    const supabase = useSupabaseClient<Database>();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<Profiles['username']>(null);
    const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null);
    const [showOptions, setShowOptions] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

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

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true);
            if(!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload');
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}.${fileExt}`;
            const filePath = `${fileName}`

            let {error: uploadError} = await supabase.storage.from('avatars').upload(filePath, file, {upsert: true});
            if(uploadError) {
                throw uploadError;
            }
            setAvatarUrl(filePath);
            updateProfile({username, avatar_url: filePath});
        } catch (exception) {
            alert('Error uploading avatar');
            console.log(JSON.stringify(exception, null, 2));
        } finally {
            setUploading(false);
        }
    }

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if(error){
          console.log("error logging out");
        } else {
            router.push('/');
        }
    }

    return (
        <div className="">
            <div className='flex flex-col justify-center items-center'>
                <div className='relative'>
                    <Avatar onClick={() => setShowOptions(old => !old)} url={avatar_url} size={50}/>
                </div>
                {showOptions && (
                    <div className='relative inline-block'>
                        <p className=''>
                            {!loading ? `signed in as ${username}` : "Loading..."}
                        </p>
                        <div className="w-[125px] absolute">
                            <div className='odd:bg-slate-200 even:bg-slate-100 pl-[10px] text-[10px]'>
                                <label className="hover:cursor-pointer hover:text-slate-500" htmlFor="single">Change profile picture</label>
                                <input className={`hidden`} type="file" id="single" accept="image/*" onChange={uploadAvatar} disabled={uploading}/>
                            </div>
                            <div className='odd:bg-slate-200 even:bg-slate-100 pl-[10px] text-[10px]'>
                                <p className="hover:cursor-pointer hover:text-slate-500" onClick={() => {
                                    
                                }}>Your Events</p>
                            </div>
                            <div className='odd:bg-slate-200 even:bg-slate-100 pl-[10px] text-[10px]' >
                                <p className="hover:cursor-pointer hover:text-slate-500" onClick={() => {
                                    
                                }}>Friends</p>
                            </div>
                            <div className='odd:bg-slate-200 even:bg-slate-100 pl-[10px] text-[10px]' >
                                <p className="hover:cursor-pointer hover:text-slate-500" onClick={() => {
                                    
                                }}>Settings</p>
                            </div>
                            <div className='odd:bg-slate-200 even:bg-slate-100 pl-[10px] text-[10px]' >
                                <p className="hover:cursor-pointer hover:text-slate-500" onClick={handleLogout}>Log out</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}