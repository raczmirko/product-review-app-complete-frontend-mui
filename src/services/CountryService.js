class CountryService {
    static async fetchCountries() {
        try {
            const response = await fetch('http://localhost:8080/country/all');
            if (!response.ok) {
                throw new Error('Failed to fetch countries');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching countries:', error);
            return [];
        }
    }
}

export default CountryService;
