import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEnvelope, FaUnlock, FaLockOpen } from 'react-icons/fa';
import IconWrapper from '../components/IconWrapper';

const Register: React.FC = () => {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmpassword, setConfirmpassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation checks
        if (!email || !password || !confirmpassword) {
            alert('Please fill out all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmpassword) {
            alert('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    role: "user",
                }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            // Store credentials in local storage
            localStorage.setItem('registeredUser', JSON.stringify({ email, password }));

            alert('Registration successful!');
            router.push('/Login');
        } catch (error) {
            alert(`Registration error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-400 to-indigo-600">
            <div className="bg-white bg-opacity-80 rounded-[10px] shadow-2xl p-8 w-full max-w-md h-[450px]">
                <form onSubmit={handleRegister}>
                    <h1 className="text-4xl text-center mb-8 mt-2 text-blue-900 font-semibold">Register</h1>
                    <div className="relative mb-5">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="border border-gray-300 p-3 w-full rounded-md pl-5"
                        />
                        <IconWrapper className='absolute right-3 top-4 text-gray-500'>
                            <FaEnvelope />
                        </IconWrapper>
                    </div>
                    <div className="relative mb-5">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="border border-gray-300 p-3 w-full rounded-md pl-5"
                        />
                        <IconWrapper className='absolute right-3 top-4 text-gray-500'>
                            <FaUnlock />
                        </IconWrapper>
                    </div>
                    <div className="relative mb-5">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmpassword}
                            onChange={e => setConfirmpassword(e.target.value)}
                            required
                            className="border border-gray-300 p-3 w-full rounded-md pl-5"
                        />
                        <IconWrapper className='absolute right-3 top-4 text-gray-500'>
                            <FaLockOpen />
                        </IconWrapper>
                    </div>
                    <button
                        type="submit"
                        className={`transition-transform duration-200 ease-in-out ${isLoading ? 'scale-95' : 'scale-100'} bg-blue-500 hover:bg-blue-600 active:bg-indigo-600 text-white rounded-md w-full h-10`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Register'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an Account? <Link href="/Login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
