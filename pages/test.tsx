import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function Test() {
    const user = useUser();
    return (
        user ? 
        <div>
            Allowed
        </div>
        :
        <div>
            Not allowed
        </div>
    );
}