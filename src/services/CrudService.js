import NotificationService from './NotificationService';

export const apiRequest = async (endpoint, method, requestBody) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(endpoint, {
            method: method,
            headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorMessage = NotificationService.getCustomNotification(response.status, await response.text());
            throw new Error(errorMessage);
        }

        var data = undefined;
        if(method === 'GET') data = await response.json();

        return { success: true, data: data ? data: undefined };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: error.message };
    }
};