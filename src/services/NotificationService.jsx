// src/services/NotificationService.js

import React, { createContext, useState, useContext } from 'react';
import AlertSnackBar from '../components/AlertSnackBar';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ isOpen: false, alertType: '', alertText: '' });

    const showNotification = (type, message) => {
    setNotification({ isOpen: true, alertType: type, alertText: message });
    };

    const closeNotification = () => {
    setNotification({ ...notification, isOpen: false });
    };

    return (
    <NotificationContext.Provider value={showNotification}>
        {children}
        <AlertSnackBar
        alertType={notification.alertType}
        alertText={notification.alertText}
        isOpen={notification.isOpen}
        setIsOpen={closeNotification}
        />
    </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};
