import Sidebar from "./Sidebar";
import React, { useEffect } from 'react';
import { Outlet, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
        } else {
            if (location.pathname !== '/login') {
                navigate(location.pathname);
            }
        }
    }, [navigate, location.pathname]);

    return (
        <div className="flex flex-row space-x-3 ml-2 bg-slate-300">
            <Sidebar />
            <Outlet />
        </div>
    );
};

export default Layout;
