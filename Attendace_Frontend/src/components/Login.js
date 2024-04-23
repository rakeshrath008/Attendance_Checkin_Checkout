import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LoginPage = () => {
    const [form, setForm] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError("Username and password are required.");
            return;
        }

        setError(null);

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to log in');
            }

            const { token, userId, username, role } = await response.json();
            Cookies.set('token', token);
            Cookies.set('username', username);
            Cookies.set('role', role);
            Cookies.set('userId', userId);
            setForm({});
            navigate('/attendance');
        } catch (error) {
            console.error('Error logging in:', error.message);
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex flex-row-reverse bg-[#7144f1] h-screen w-screen relative">
            <img src="/LoginPage/logo.png" alt="time-tracking-icon" className='absolute left-9 top-5 w-7' />
            <p className='text-white w-48 text-3xl top-[12%] left-[3%] absolute'>Stay on top of time tracking</p>
            <img src="/LoginPage/people.png" alt="time-tracking-logo" className='absolute w-[25rem] left-[4%] top-[28%]' />
            <div className='bg-white h-screen w-9/12 flex justify-center items-center rounded-tl-3xl rounded-bl-3xl'>
                <form className='flex flex-col text-center gap-8 items-center w-[35%] h-[60%]' onSubmit={handleSubmit}>
                    <h1 className='font-extrabold opacity-80 text-3xl'>Welcome back !</h1>
                    <div className="w-[80%] relative">
                        <label htmlFor="email" className='absolute text-[.75rem] text-gray-600 tracking-wide -top-2 left-3 z-20 bg-white rounded-full px-1'>Email</label>
                        <input type="text" name='email' id='email' className='outline-none border-2 border-opacity-40 h-10 w-full rounded-xl p-2 text-black border-[#676666] bg-white' value={form.email || ''} onChange={handleForm} />
                    </div>
                    <div className="w-[80%] relative">
                        <label htmlFor="password" className='absolute text-[.75rem] text-gray-600 tracking-wide -top-2 left-3 z-20 bg-white px-1'>Password</label>
                        <input type="password" name='password' id='password' className='border-2 border-opacity-40 h-10 w-full rounded-xl p-2 text-black border-[#676666]' value={form.password || ''} onChange={handleForm} />
                    </div>
                    <button type='submit' className='border h-10 w-[80%] text-white bg-[#212121] hover:text-blue-300 hover:bg-slate-800 rounded-xl tracking-wider'>Login</button>
                    {error && <p className='text-red-500 flex -mt-3'>{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default LoginPage;