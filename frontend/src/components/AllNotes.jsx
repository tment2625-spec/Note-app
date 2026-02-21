import React, { useState, useEffect } from 'react'
import { useNotification } from '../context/NotificationContext';

export default function AllNotes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [user, setUser] = useState(() => {
        try {
            const userData = localStorage.getItem("data");
            if (userData && userData !== "undefined" && userData !== "null") {
                return JSON.parse(userData);
            }
            if (userData === "undefined" || userData === "null") {
                localStorage.removeItem("data");
            }
            return null;
        } catch (e) {
            console.error("Error parsing user data:", e);
            localStorage.removeItem("data");
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const api = 'http://localhost:5000/api/notes';
            const res = await fetch(api);
            
            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();
            
            if (Array.isArray(data)) {
                // Filter notes for the current user locally
                const userNotes = data.filter(n => n.username === user.username);
                setNotes(userNotes);
            } else {
                console.error("Unexpected data format:", data);
                setNotes([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setLoading(false);
        }
    };

    const { showNotification, showConfirm } = useNotification();

    const handleDelete = async (id) => {
        showConfirm(
            "Move to Trash",
            "Are you sure you want to move this note to trash? You can restore it later from the Trash page.",
            async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        setNotes(notes.filter(n => n._id !== id));
                        showNotification("Note moved to trash", "success");
                    } else {
                        showNotification("Failed to move note to trash", "error");
                    }
                } catch (error) {
                    console.error('Error moving note to trash:', error);
                    showNotification("An error occurred", "error");
                }
            }
        );
    };

    // Search Logic
    const filteredNotes = notes.filter(n => 
        n.note.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!user) return <div className='message'>Please login to see your notes.</div>;

    return (
        <div className='all-notes-page'>
            <header className='all-notes-header'>
                <h2>My Saved Notes</h2>
                <div className='search-bar'>
                    <input 
                        type="text" 
                        placeholder='Search your notes...' 
                        className='search-input' 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>
            
            {loading ? (
                <div className='message'>Loading notes...</div>
            ) : (
                <div className='all-notes-grid'>
                    {filteredNotes.length === 0 ? (
                        <div className='message'>
                            {searchTerm ? `No notes matching "${searchTerm}"` : "No notes found. Start by adding some!"}
                        </div>
                    ) : (
                        filteredNotes.map(note => (
                            <div key={note._id} className='note-card glass-card'>
                                <p className='note-content'>{note.note}</p>
                                <div className='note-footer'>
                                    <span className='note-date'>
                                        {new Date(note.date).toLocaleDateString()}
                                    </span>
                                    <button 
                                        onClick={() => handleDelete(note._id)} 
                                        className='btn-delete'
                                        title='Move to Trash'
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
