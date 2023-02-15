// https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs#create-an-upload-widget
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from 'react';
import { Database } from "@/utils/database.types";
import DefaultAvatar from '../public/defaultAvatar.png';
import Image from 'next/image';
import { buttonStyle } from "@/styles/buttonsClasses";
type Profiles = Database['public']['Tables']['profiles']['Row'];

export default function Avatar({uid, url, size, onUpload} : {uid: string, url: Profiles['avatar_url'], size: number, onUpload: (url: string) => void}) {
    
    const supabase = useSupabaseClient<Database>();
    const [avatarUrl, setAvatarUrl] = useState<Profiles['avatar_url']>(null);
    const [uploading, setUploading] = useState(false);

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

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true);
            if(!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload');
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${uid}.${fileExt}`;
            const filePath = `${fileName}`

            let {error: uploadError} = await supabase.storage.from('avatars').upload(filePath, file, {upsert: true});
            if(uploadError) {
                throw uploadError;
            }
            onUpload(filePath);
        } catch (exception) {
            alert('Error uploading avatar');
            console.log(JSON.stringify(exception, null, 2));
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className={``}>
            {avatarUrl ? (
                <Image src={avatarUrl} alt='User Avatar' width={size} height={size}/>
            ) : (
                <Image src={DefaultAvatar} alt="Default Avatar" width={size} height={size}/>
            )}
            <div className={`w-[${size}px]`}>
                <label className={`w-[${size}px] ${buttonStyle}`} htmlFor="single">
                    {uploading ? "Uploading..." : "Upload an avatar"}
                </label>
                <input className={`hidden w-[${size}px]`} type="file" id="single" accept="image/*" onChange={uploadAvatar} disabled={uploading}/>
            </div>
        </div>
    )
}