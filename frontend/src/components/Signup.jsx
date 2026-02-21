import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export default function Signup() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleSignup = async (e) => {
        e.preventDefault();
        
        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        const apiRoute = "http://localhost:5000";
        try {
            const res = await fetch(`${apiRoute}/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                showNotification("Account created successfully! Please login.", "success");
                navigate("/login");
            } else {
                showNotification(data.message || "Signup failed", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Something went wrong. Please try again.", "error");
        }
    };

    return (
        <div className='auth-wrapper'>
            <div className='auth-card glass-card'>
                <h1>Create Account</h1>
                <p className='auth-subtitle'>Join NoteApp today</p>
                <form onSubmit={handleSignup} className='auth-form'>
                    <div className='input-group'>
                        <label>Username</label>
                        <input type="text" placeholder='johndoe' required />
                    </div>
                    <div className='input-group'>
                        <label>Email</label>
                        <input type="email" placeholder='john@example.com' required />
                    </div>
                    <div className='input-group'>
                        <label>Password</label>
                        <input type="password" placeholder='••••••••' required />
                    </div>
                    <button type='submit' className='btn-primary'>Sign Up</button>
                </form>
                <div className='auth-footer'>
                    <span>Already have an account? </span>
                    <Link to="/login" className='auth-link'>Login</Link>
                </div>
            </div>
        </div>
    );
}
