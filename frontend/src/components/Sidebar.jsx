import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { showNotification, showConfirm } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  let user = {};
  try {
    const userData = localStorage.getItem("data");
    if (userData && userData !== "undefined" && userData !== "null") {
      user = JSON.parse(userData);
    } else if (userData === "undefined" || userData === "null") {
      localStorage.removeItem("data");
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    localStorage.removeItem("data");
  }

  const handleLogout = () => {
    showConfirm(
      "Confirm Logout",
      "Are you sure you want to log out? You will need to sign in again to access your notes.",
      () => {
        setIsOpen(false);
        localStorage.removeItem("data");
        localStorage.removeItem("isLoggedIn");
        showNotification("Logged out successfully", "success");
        navigate("/login");
      }
    );
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="mobile-toggle" onClick={toggleSidebar}>
        {isOpen ? '✕' : '☰'}
      </button>

      <div className={`sidebar glass-card ${isOpen ? 'mobile-open' : ''}`}>
        <div className='sidebar-header'>
          <h1>Notes</h1>
        </div>
        <nav className='sidebar-nav'>
          <ul>
            <Link to="/" onClick={() => setIsOpen(false)}><li><span className="icon">🏠</span> Home</li></Link>
            <Link to="/mynotes" onClick={() => setIsOpen(false)}><li><span className="icon">📝</span> All Notes</li></Link>
            <Link to="/trash" onClick={() => setIsOpen(false)}><li><span className="icon">🗑️</span> Trash</li></Link>
          </ul>
        </nav>
        <div className='sidebar-footer mobile-visible'>
          {isLoggedIn ? (
            <div className='user-profile'>
              <div className='user-info'>
                <p className='user-name'>{user.username}</p>
                <p className='user-email'>{user.email}</p>
              </div>
              <button onClick={handleLogout} className='btn-logout'>Logout</button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}><button className='btn-primary'>Login</button></Link>
          )}
        </div>
      </div>
      
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}
