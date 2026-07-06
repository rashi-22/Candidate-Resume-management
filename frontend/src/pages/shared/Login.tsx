import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

export const Login: React.FC = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [fields, setFields] = useState({ username: '', password: '' })
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields({ ...fields, [e.target.name]: e.target.value })
    }


    const handleFormSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('')
        try {
            if (fields.username === 'admin' && fields.password === 'admin123') {
                login('admin-tocken', { id: 0, username: 'admin', role: 'admin' })
                return navigate('/admin/dashboard')
            }

            const res = await api.post('/candidates/login', fields)
            if (!res.data.is_active) {
                setError('This account is pending confirmation.')
                return
            }

            login(res.data.accessToken, { id: res.data.id, username: res.data.username, role: 'candidate' })
            navigate('/candidate/profile')
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Invalid Credentials')
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-slate-200">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Sign In</h2>
                <p className="text-xs text-center text-slate-400 mb-6">Access Candidate Profile or Admin Workspace</p>

                {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-semibold mb-4">{error}</div>}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Username</label>
                        <input required type="text" name="username" value={fields.username} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
                        <input required type="password" name="password" value={fields.password} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition-colors shadow-sm">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm text-slate-500">
                    New candidate? <Link to="/register-step1" className="text-blue-600 hover:underline font-semibold">Create account</Link>
                </div>
            </div>
        </div>
    );
}