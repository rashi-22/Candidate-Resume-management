import React, { createContext, useContext, useEffect, useState } from 'react'

export interface UserSession {
    id: number;
    username: string;
    role: 'admin' | 'candidate'
}

interface AuthContextProps {
    user: UserSession | null;
    token: string | null;
    login: (token: string, user: UserSession) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if( storedToken && storedUser){
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = (newToken: string, newUser: UserSession) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser))
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            { !loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be called inside an Authprovider scope');
    return context;
}