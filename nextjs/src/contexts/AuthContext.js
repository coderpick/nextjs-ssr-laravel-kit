import { createContext, useContext, useState, useEffect } from 'react';
import * as authHelpers from '@/lib/authorize';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children, initialUser }) {


    const [user, setUser] = useState(initialUser);
    const [csrf, setCsrf] = useState({
        token: null,
        signature: null
    });

    useEffect(() => {
        if (!csrf.token) {
            const fetchCsrfToken = async () => {
                const response = await axios.get('/api/auth/csrf');
                setCsrf({
                    token: response.data.token,
                });
            };
            fetchCsrfToken();
        }
    }, [csrf.token]);
    


    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
        }
    }, [initialUser]);

    const authHelpersFunctions = {
        user,
        ...Object.fromEntries(
            Object.entries(authHelpers).map(([key, func]) => [key, (...args) => func(user, ...args)])
        ),
    };

    return (
        <AuthContext.Provider value={{ user, csrf, setCsrf, ...authHelpersFunctions }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 