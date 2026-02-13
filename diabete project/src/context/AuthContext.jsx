import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // In a real app, you might want to validate the token with the backend here
            // For now, we'll just decode it or assume valid if present
            // Let's at least decode the username if possible, or just set a dummy user
            // Ideally, we'd hit a /me endpoint
            fetch('http://localhost:8000/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Invalid token');
                })
                .then(data => setUser(data))
                .catch(() => {
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('http://localhost:8000/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        // After setting token, the useEffect will trigger and fetch user details
        // Or we can manually fetch/set user here to be faster
        const userRes = await fetch('http://localhost:8000/users/me', {
            headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);
        }
    };

    const register = async (email, password) => {
        const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
        }

        // Auto-login after registration? Or redirect to login?
        // Let's just return true and let the component handle redirect
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
