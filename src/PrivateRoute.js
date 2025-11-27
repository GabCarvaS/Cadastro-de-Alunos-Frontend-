import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('userToken');
    const expirationTime = localStorage.getItem('expiration');

    const now = new Date().getTime();

    const isTokenExpired = expirationTime && (now > new Date(expirationTime).getTime());

    const isAuthenticated = token && !isTokenExpired;

    if (isTokenExpired && token) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('expiration');
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;