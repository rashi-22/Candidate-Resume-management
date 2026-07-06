import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps{
    allowedRules: ('admin' | 'candidate')[];
}
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({allowedRules}) => {
    const {token, user} = useAuth()

    if(!token) return <Navigate to='/login' replace/>
    if(!user || !allowedRules.includes(user.role))  return <Navigate to='/unauthorized' replace/>

    return <Outlet/>
}