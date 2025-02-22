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
        // IMPORTANT: In a real application, NEVER store passwords directly.
        // This is a simplified example.  You would normally send credentials
        // to a server for authentication, and receive a token (e.g., JWT)
        // which you would store in localStorage or a secure cookie.

        // Check local storage for existing user.
        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        if (storedUsers[username] && storedUsers[username].password === password) {
            const loggedInUser = {
                username: storedUsers[username].username,
                email: storedUsers[username].email,
                phone: storedUsers[username].phone,
                dateOfBirth: storedUsers[username].dateOfBirth,
            };
              setUser(loggedInUser);
            return true;
        }


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
         // Check for existing user
        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        if (storedUsers[username]) {
            // User already exists
            return false;
        }
        const newUser = {
            username,
            email,
            phone,
            dateOfBirth,
            password, // Again, NEVER store plain text passwords in a real app!
        };
         // Store the new user in the 'users' object in localStorage
        storedUsers[username] = newUser;
        localStorage.setItem('users', JSON.stringify(storedUsers));

        setUser(newUser); // Log the user in
        return true;
    };
    const logout = () => {
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        // Update the user information in localStorage as well
      const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
      storedUsers[updatedUser.username] = {
          ...storedUsers[updatedUser.username], //Keep the passowrd
        ...updatedUser,
      };

      localStorage.setItem('users', JSON.stringify(storedUsers));
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