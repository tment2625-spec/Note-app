import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export default function Login() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const username = e.target[0].value;
        const password = e.target[1].value;

        const apiRoute = "http://localhost:5000";
        try {
            const res = await fetch(`${apiRoute}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (res.ok) {
                console.log("Login success:", data);
                localStorage.setItem("data", JSON.stringify(data.user));
                localStorage.setItem("isLoggedIn", "true");
                showNotification("Welcome back, " + data.user.username + "!", "success");
                navigate("/");
            } else {
                showNotification(data.message || "Login failed", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Something went wrong. Please try again.", "error");
        }
    };

    return (
        <div className='auth-wrapper'>
            <div className='auth-card glass-card'>
                <h1>Login</h1>
                <p className='auth-subtitle'>Welcome back to NoteApp</p>
                <form onSubmit={handleLogin} className='auth-form'>
                    <div className='input-group'>
                        <label>Username</label>
                        <input type="text" placeholder='johndoe' required />
                    </div>
                    <div className='input-group'>
                        <label>Password</label>
                        <input type="password" placeholder='••••••••' required />
                    </div>
                    <button type='submit' className='btn-primary'>Login</button>
                </form>
                <div className='auth-footer'>
                    <span>Don't have an account? </span>
                    <Link to="/signup" className='auth-link'>Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
