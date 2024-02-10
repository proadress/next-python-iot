'use client'

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";


interface Token {
    access_token: string;
    token_type: string;
}



const LoginForm = () => {
    const router = useRouter()
    const startLogin = async (formData: FormData) => {
        try {
            console.log(formData);
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const token: Token = await response.json()
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
            <div className="p-8 bg-gray-800 rounded-md shadow-md w-96">
                <h1 className="text-3xl font-semibold mb-6">Login</h1>
                <form action={startLogin}>
                    <input className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md"
                        type="text"
                        name="username"
                        placeholder="Username"
                        autoComplete="username"
                        required />
                    <input className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md"
                        type="password"
                        name="password"
                        placeholder="Password"
                        required />
                    <button className="w-full py-2 bg-blue-500  rounded-md hover:bg-blue-600"  >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
export default LoginForm;
