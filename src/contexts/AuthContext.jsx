// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (username, password) => {
        if (username === 'student' && password === 'student') {
            const newUser = {
                username: 'student',
                email: 'student@example.com',
                phone: '123-456-7890',
                dateOfBirth: '1990-01-01'
            };
            setUser(newUser);
            return true;
        }
        return false;
    };

    const signup = (username, email, phone, dateOfBirth, password) => {
        const newUser = {
            username,
            email,
            phone,
            dateOfBirth,
        };
        setUser(newUser); // Consider better password handling in reality
        return true;
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};