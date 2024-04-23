import Cookies from 'js-cookie';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate,useLocation  } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { HomeIcon, SunIcon , UsersIcon } from '@heroicons/react/outline';

const Sidebar = () => {
    const role = Cookies.get('role');
    const userName = Cookies.get('username') || '';
    const [showAdmin] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handlePopupToggle = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsPopupOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const isCurrentPage = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        const cookies = Cookies.get();
        for (const cookie in cookies) {
            Cookies.remove(cookie);
        }
        navigate('/login');
    }
    return (
        <div className='h-screen w-1/5'>
            {showAdmin && (
                <div className='bg-white h-screen justify-between relative'>
                        <h3 className='text-gray-700 font-bold ml-8 p-2 text-xl'>  {role === 'admin' ? 'Admin' : role === 'hr' ? 'Hr' : 'User'}</h3>
                    <br />
                    {role === 'admin' && (
                        <div className=' cursor-pointer'>
                            <ul className="list-none space-y-2">
                                <li className={`flex flex-col h-8 justify-center items-center w-full hover:bg-blue-50 hover:text-blue-600 ${isCurrentPage("/attendance") && "bg-blue-50 text-blue-600"}`}>
                                    <Link to="/attendance" className='flex text-gray-700 hover:text-blue-600 ml-5 w-full'>
                                        <HomeIcon className="text-blue-500 h-5 w-5 mr-2" />
                                        <span className='font-semibold opacity-60'>Attendance</span>
                                    </Link>
                                </li>
                                <li className={`flex flex-col h-8 justify-center items-center w-full hover:bg-blue-50 hover:text-blue-600 ${isCurrentPage("/holidays") && "bg-blue-50 text-blue-600"}`}>
                                    <Link to="/holidays" className='flex text-gray-700 hover:text-blue-600 ml-5 w-full'>
                                        <SunIcon className="text-blue-500 h-5 w-5 mr-2" />
                                       <span className='font-semibold opacity-60'> Holidays</span>
                                    </Link>
                                </li>
                                <li className={`flex flex-col h-8 justify-center items-center w-full hover:bg-blue-50 hover:text-blue-600 ${isCurrentPage("/manage-users") && "bg-blue-50 text-blue-600"}`}>
                                    <Link to="/manage-users" className='flex text-gray-700 ml-5 w-full hover:text-blue-600'>
                                        <UsersIcon className="text-blue-500 h-5 w-5 mr-2" />
                                        <span className='font-semibold opacity-60'> Manage Users</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                   {role === 'hr' && (
                        <div className=' cursor-pointer'>
                            <ul className="list-none space-y-2">
                                <li className={`flex flex-col h-8 justify-center items-center w-full hover:bg-blue-50 hover:text-blue-600 ${isCurrentPage("/attendance") && "bg-blue-50 text-blue-600"}`}>
                                    <Link to="/attendance" className='flex text-gray-700 hover:text-blue-600 ml-5 w-full'>
                                        <HomeIcon className="text-blue-500 h-5 w-5 mr-2" />
                                        <span className='font-semibold opacity-60'>Attendance</span>
                                    </Link>
                                </li>
                                <li className={`flex flex-col h-8 justify-center items-center w-full hover:bg-blue-50 hover:text-blue-600 ${isCurrentPage("/holidays") && "bg-blue-50 text-blue-600"}`}>
                                    <Link to="/holidays" className='flex text-gray-700 hover:text-blue-600 ml-5 w-full'>
                                        <SunIcon className="text-blue-500 h-5 w-5 mr-2" />
                                       <span className='font-semibold opacity-60'> Holidays</span>
                                    </Link>
                                </li>
                                <li className={`flex flex-col h-8 justify-center items-center w-full hover:bg-blue-50 hover:text-blue-600 ${isCurrentPage("/manage-users") && "bg-blue-50 text-blue-600"}`}>
                                    <Link to="/manage-users" className='flex text-gray-700 ml-5 w-full hover:text-blue-600'>
                                        <UsersIcon className="text-blue-500 h-5 w-5 mr-2" />
                                        <span className='font-semibold opacity-60'> Manage Users</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                    <div className='flex flex-row items-center bg-blue-50 hover:bg-blue-100 cursor-pointer absolute bottom-0 left-0 w-full h-fit'>
                        <div className='flex flex-row justify-center items-center ml-2 h-full'>
                            <span className="flex justify-center items-center mb-1 w-8 h-8 mr-2 mt-1 rounded-full border border-blue-400 bg-gray-300">{userName.charAt(0)}</span>
                            <p className="flex justify-center items-center text-black font-serif h-full">{userName.split(' ')[0]}</p>
                        </div>
                        <div className='relative' ref={popupRef}>
                            <p className="text-gray-600 font-bold text-3xl ml-20 mb-3 cursor-pointer" onClick={handlePopupToggle}>&#8230;</p>
                            {isPopupOpen && (
                                <div className="absolute top-0 left-[4pc] mt-[-1.3pc] bg-white border border-gray-200 shadow-md rounded-xl p-1 hover:bg-red-600">
                                    <button onClick={handleLogout} className="text-red-600 rounded-xl hover:text-white">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar;
