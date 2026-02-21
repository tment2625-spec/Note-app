import React, { useState, useEffect } from 'react'
import { useNotification } from '../context/NotificationContext';

export default function Trash() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification, showConfirm } = useNotification();

    const [user] = useState(() => {
        try {
            const userData = localStorage.getItem("data");
            if (userData && userData !== "undefined" && userData !== "null") {
                return JSON.parse(userData);
            }
            return null;
        } catch (e) {
            console.error("Error parsing user data:", e);
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            fetchTrashedNotes();
        }
    }, [user]);

    const fetchTrashedNotes = async () => {
        try {
            setLoading(true);
            const api = 'http://localhost:5000/api/notes/trash';
            const res = await fetch(api);
            
            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data = await res.json();
            
            if (Array.isArray(data)) {
                const userNotes = data.filter(n => n.username === user.username);
                setNotes(userNotes);
            } else {
                setNotes([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trashed notes:', error);
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/notes/restore/${id}`, {
                method: 'PUT'
            });
            if (res.ok) {
                setNotes(notes.filter(n => n._id !== id));
                showNotification("Note restored successfully", "success");
            } else {
                showNotification("Failed to restore note", "error");
            }
        } catch (error) {
            console.error('Error restoring note:', error);
            showNotification("An error occurred", "error");
        }
    };

    const handlePermanentDelete = async (id) => {
        showConfirm(
            "Permanent Delete",
            "Are you sure you want to permanently delete this note? This action cannot be undone.",
            async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/notes/permanent/${id}`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        setNotes(notes.filter(n => n._id !== id));
                        showNotification("Note permanently deleted", "success");
                    } else {
                        showNotification("Failed to delete note", "error");
                    }
                } catch (error) {
                    console.error('Error deleting note:', error);
                    showNotification("An error occurred", "error");
                }
            }
        );
    };

    if (!user) return <div className='message'>Please login to see your trash.</div>;

    return (
        <div className='all-notes-page'>
            <header className='all-notes-header'>
                <h2>Trash</h2>
                <div className='search-bar'>
                    <p style={{color: 'var(--text-muted)'}}>{notes.length} items in trash</p>
                </div>
            </header>
            
            {loading ? (
                <div className='message'>Loading trash...</div>
            ) : (
                <div className='all-notes-grid'>
                    {notes.length === 0 ? (
                        <div className='message'>Trash is empty.</div>
                    ) : (
                        notes.map(note => (
                            <div key={note._id} className='note-card glass-card' style={{opacity: 0.8}}>
                                <p className='note-content'>{note.note}</p>
                                <div className='note-footer'>
                                    <span className='note-date'>
                                        Trashed: {new Date(note.date).toLocaleDateString()}
                                    </span>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <button 
                                            onClick={() => handleRestore(note._id)} 
                                            className='btn-delete'
                                            title='Restore'
                                            style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)'}}
                                        >
                                            🔄
                                        </button>
                                        <button 
                                            onClick={() => handlePermanentDelete(note._id)} 
                                            className='btn-delete'
                                            title='Delete Permanently'
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
