const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const activateDeactivateUser = async (username, isActive) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await fetch(`${API_BASE_URL}/user/${username}/activate-deactivate?isActive=${isActive}`, {
            method: 'PUT',
            headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        } 

        // Check if response has content before parsing JSON
        const isJson = response.headers.get("content-type")?.includes("application/json");
        const data = isJson ? await response.json() : null; // If no JSON, return null

        return { success: response.ok, data };
    } catch (error) {
        console.error('Error fetching user:', error);
        return [];
    }
}
