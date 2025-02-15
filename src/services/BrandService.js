const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

class BrandService {
    static async fetchBrands() {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`${API_BASE_URL}/brand/all`, { headers });
            if (!response.ok) {
                throw new Error('Failed to fetch brands');
            }
            if (response.status === 204) {
                return [];
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
            return [];
        }
    }
}

export default BrandService;
