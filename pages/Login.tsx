import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from 'next/link';
import IconWrapper from '../components/IconWrapper';

const Login: React.FC = () => {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email || !password) {
            alert('Please fill out all fields.');
            return;
        }

        setIsLoading(true);

        if (email === "admin@gmail.com" && password === "GodsGift2019") {
            const admin = {
                email: email,
                password: password
            }
            localStorage.setItem("user", JSON.stringify(admin));
            alert('Admin Logged In!!');
            router.push('Admin');
            setIsLoading(false);
            return;
        } else {
            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                });
    
                if (response.ok) {
                    const result = await response.json();
                    localStorage.setItem("user", JSON.stringify(result.user));
                    router.push('/Information');
                    alert('Login successful!');
                } else {
                    throw new Error('Logging in failed');
                }
            } catch (error) {
                alert(`Login error: ${error}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-400 to-indigo-600'>
            <h4 className="absolute top-4 left-6 text-2xl text-blue-900 font-normal">GOD&apos;S GIFT</h4>
            <div className="bg-white bg-opacity-80 rounded-[10px] p-8 shadow-2xl w-96 translate-y-1 h-[380px]">
                <h1 className="text-4xl text-blue-900 mb-8 mt-2 text-center font-semibold">Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="relative mb-5">
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <IconWrapper className='absolute right-3 top-4 text-gray-500'>
                            <FaEnvelope />
                        </IconWrapper>
                    </div>
                    <div className="relative mb-5">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <span className="absolute right-3 top-4 cursor-pointer" onClick={togglePasswordVisibility}>
                            <IconWrapper className='text-gray-500'>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </IconWrapper>
                        </span>
                    </div>
                    <button 
                        type="submit" 
                        className={`transition-transform duration-200 ease-in-out ${isLoading ? 'scale-95' : 'scale-100'} bg-blue-500 hover:bg-blue-600 active:bg-indigo-600 text-white rounded-md w-full h-10`}
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                    <div className="mt-4 text-center">
                        <p>Don&apos;t have an account? 
                            <Link href="/Register" className="text-blue-500 hover:underline"> Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
