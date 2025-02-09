const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

class CountryService {
    static async fetchCountries() {
        try {
            const response = await fetch(`${API_BASE_URL}/country/all`);
            if (!response.ok) {
                throw new Error('Failed to fetch countries');
            }
            if (response.status === 204) {
                return [];
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
            return [];
        }
    }
}

export default CountryService;
