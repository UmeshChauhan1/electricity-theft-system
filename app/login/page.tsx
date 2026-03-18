// "use client" directive to enable client-side rendering
'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const LoginPage = () => {
    const router = useRouter();

    const handleLogin = () => {
        // Handle login logic here
        router.push('/dashboard'); // Redirect to dashboard after login
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <input className="mb-4 p-2 border rounded" type="text" placeholder="Username" />
            <input className="mb-4 p-2 border rounded" type="password" placeholder="Password" />
            <button className="p-2 bg-blue-500 text-white rounded" onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;