import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const [modal, setModal] = useState(null);

    const showNotification = useCallback((message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const showConfirm = useCallback((title, message, onConfirm) => {
        setModal({ title, message, onConfirm });
    }, []);

    const closeNotification = () => setNotification(null);
    const closeModal = () => setModal(null);

    return (
        <NotificationContext.Provider value={{ showNotification, showConfirm }}>
            {children}
            
            {/* Notification Portal */}
            {notification && (
                <div className={`notification-toast glass-card ${notification.type}`}>
                    <p>{notification.message}</p>
                    <button onClick={closeNotification} className="toast-close">&times;</button>
                </div>
            )}

            {/* Confirm Modal Portal */}
            {modal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <h3>{modal.title}</h3>
                        <p>{modal.message}</p>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                            <button className="btn-danger" onClick={() => {
                                modal.onConfirm();
                                closeModal();
                            }}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};
