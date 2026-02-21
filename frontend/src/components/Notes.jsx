import React from 'react';
import { useNotification } from '../context/NotificationContext';

export default function Notes() {
  const { showNotification } = useNotification();

  const addNote = async ( e ) => {
    e.preventDefault();
    const note = e.target[0].value;
    
    const userData = localStorage.getItem("data");
    let user = null;
    if (userData && userData !== "undefined" && userData !== "null") {
        try {
            user = JSON.parse(userData);
        } catch (e) {
            console.error("Error parsing user data:", e);
            localStorage.removeItem("data");
        }
    } else if (userData === "undefined" || userData === "null") {
        localStorage.removeItem("data");
    }

    if (!user) {
      showNotification("Please login to add notes", "error");
      return;
    }

    const { username } = user;

    try {
      const apiUrl = "https://note-app-mzs2.onrender.com/api/add-note";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, note }),
      });

      if (response.ok) {
        e.target[0].value = "";
        showNotification("Note added successfully!", "success");
      } else {
        showNotification("Failed to add note", "error");
      }
    } catch (err) {
      console.error("Failed to add note:", err);
      showNotification("An error occurred. Please try again.", "error");
    }
  };

  return (
    <div className='notes-page'>
      <header className='notes-header'>
        <h2>My Notes</h2>
        <div className='search-bar'>
            <input type="text" placeholder='Search notes...' />
        </div>
      </header>
      
      <div className='notes-grid'>
        {/* Placeholder for existing notes */}
        <div className='note-card glass-card'>
          <p>Sample Note: Welcome to your premium note app! Start by adding your first note below.</p>
          <span className='note-date'>Oct 24, 2023</span>
        </div>
      </div>

      <div className='new-note-container'>
        <form onSubmit={addNote} className='new-note-form glass-card'>
          <input type="text" placeholder='Type your note here...' required />
          <button type='submit' className='btn-add'>
            <span className="plus-icon">+</span>
          </button>
        </form>
      </div>
    </div>
  );
}
