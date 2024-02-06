'use client'
import { deleteCookie } from "cookies-next";
import { useRouter } from 'next/navigation'
import React from "react";

const Logout: React.FC = () => {
    const router = useRouter()

    return (<div>
        <button onClick={() => {
            deleteCookie('token');
            router.push('/login'); // Navigate to the new post page
        }}>logout</button>
    </div>)
}

export default Logout;