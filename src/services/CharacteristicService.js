class CharacteristicService {
    static async fetchCategoryTreeCharacteristics(id) {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`http://localhost:8080/characteristic/${id}/list-characteristic-category-trees`, {headers});
            if (!response.ok) {
                throw new Error('Failed to fetch assigned category tree');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching assigned category tree:', error);
            return [];
        }
    };

    static async fetchCharacteristic(id) {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`http://localhost:8080/characteristic/${id}`, {headers});
            if (!response.ok) {
                throw new Error('Failed to fetch characteristic.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching characteristic:', error);
            return [];
        }
    };

    static async fetchAvailableCharacteristics(categoryId) {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`http://localhost:8080/characteristic/${categoryId}/available-characteristics`, {headers});
            if (!response.ok) {
                throw new Error('Failed to fetch available characteristics');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching available characteristics:', error);
            return [];
        }
    }

    static async listInheritedCharacteristics(categoryId) {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`http://localhost:8080/characteristic/${categoryId}/list-inherited-characteristics`, {headers});
            if (!response.ok) {
                throw new Error('Failed to fetch inherited characteristics');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching inherited characteristics:', error);
            return [];
        }
    }
}

export default CharacteristicService;