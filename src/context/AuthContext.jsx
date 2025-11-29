import { createContext, useContext, useState, useEffect } from 'react';
import {
    getUser,
    saveUser,
    removeUser,
    findUserByEmail,
    addUser,
    initializeDefaultUsers,
    generateId
} from '../utils/storage';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize default users
        initializeDefaultUsers();

        // Check for existing user session
        const currentUser = getUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const foundUser = findUserByEmail(email);

        if (!foundUser) {
            throw new Error('User not found. Please check your email or register.');
        }

        if (foundUser.password !== password) {
            throw new Error('Incorrect password. Please try again.');
        }

        // Don't store password in session
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        saveUser(userWithoutPassword);

        return userWithoutPassword;
    };

    const register = async (name, email, password, role = 'student') => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const existingUser = findUserByEmail(email);

        if (existingUser) {
            throw new Error('An account with this email already exists. Please login instead.');
        }

        const newUser = {
            id: generateId('user'),
            name,
            email,
            password,
            role,
            createdAt: new Date().toISOString(),
        };

        addUser(newUser);

        // Don't store password in session
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        saveUser(userWithoutPassword);

        return userWithoutPassword;
    };

    const logout = () => {
        setUser(null);
        removeUser();
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
