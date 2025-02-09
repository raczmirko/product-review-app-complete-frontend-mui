const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

class PackagingService {
    static async fetchPackagings() {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`${API_BASE_URL}/packaging/all`, {headers});
            if (!response.ok) {
                throw new Error('Failed to fetch packagings.');
            }
            if (response.status === 204) {
                return [];
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching packagings:', error);
            return [];
        }
    };

    static async fetchAvailablePackagings(articleId) {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`${API_BASE_URL}/packaging/${articleId}/available-options`, {headers});
            if (!response.ok) {
                throw new Error('Failed to fetch available packagings.');
            }
            if (response.status === 204) {
                return [];
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching available packagings:', error);
            return [];
        }
    };
}

export default PackagingService;
