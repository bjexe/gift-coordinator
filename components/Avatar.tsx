import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from 'react';
import { Database } from "@/utils/database.types";
import DefaultAvatar from '../public/defaultAvatar.png';
import Image from 'next/image';
type Profiles = Database['public']['Tables']['profiles']['Row'];

export default function Avatar({url, size, onClick} : {url: Profiles['avatar_url'], size: number, onClick: () => void}) {
    
    const supabase = useSupabaseClient<Database>();
    const [avatarUrl, setAvatarUrl] = useState<Profiles['avatar_url']>(null);

    useEffect(() => {
        if(url) downloadImage(url);
    }, [url])

    async function downloadImage(path: string) {
        try {
            const {data, error} = await supabase.storage.from('avatars').download(path);
            if(error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (exception) {
            console.log(`Error downloading image: ${JSON.stringify(exception, null, 2)}`);
        }
    }

    return (
        <div className={``}>
            {avatarUrl ? (
                <Image className="hover:cursor-pointer" onClick={onClick} src={avatarUrl} alt='User Avatar' width={size} height={size}/>
            ) : (
                <Image onClick={onClick} src={DefaultAvatar} alt="Default Avatar" width={size} height={size}/>
            )}
        </div>
    )
}