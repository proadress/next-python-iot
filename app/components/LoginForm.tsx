'use client'

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface User {
    username: string;
    password: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}



const LoginForm = () => {
    const [username, setUsername] = useState("s");
    const [password, setPassword] = useState("s");

    const router = useRouter()

    // login.ts

    async function login(username: string, password: string): Promise<Token> {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('/api/auth/token', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    }

    const startLogin = async () => {
        try {
            const token = await login(username, password);
            console.log('Access Token:', token.access_token);
            setCookie('token', token.access_token);
            router.push('/')
        } catch (error) {
            console.error('Registration failed:', (error as Error).message);
            alert('Registration failed');
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-8 bg-gray-800 rounded-md shadow-md w-96 text-white">
                <h1 className="text-3xl font-semibold mb-6">Login</h1>
                <input
                    className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="w-full py-2 bg-blue-500  rounded-md hover:bg-blue-600"
                    onClick={() => startLogin()}
                >
                    Login
                </button>
            </div>
        </div>
    )
}
export default LoginForm;
