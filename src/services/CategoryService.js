const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

class CategoryService {
    static async fetchCategories() {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`${API_BASE_URL}/category/all`, { headers });
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            if (response.status === 204) {
                return [];
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    static async fetchAvailableParentCategories() {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`${API_BASE_URL}/category/available-parent-categories`, { headers });
            if (!response.ok) {
                throw new Error('Failed to fetch available parent categories');
            }
            if (response.status === 204) {
                return [];
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching available parent categories:', error);
            return [];
        }
    }

    static async fetchLeafCategories() {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`${API_BASE_URL}/category/leaf-categories`, { headers });
            if (!response.ok) {
                throw new Error('Failed to fetch leaf categories');
            }
            if (response.status === 204) {
                return [];
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching leaf categories:', error);
            return [];
        }
    }

    static async getCategory(id) {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`${API_BASE_URL}/category/${id}`, { headers });
            if (!response.ok) {
                throw new Error('Failed to fetch category');
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            return [];
        }
    }

    static async fetchCategoryTree(id) {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`${API_BASE_URL}/category-hierarchy/${id}`, { headers });
            if (!response.ok) {
                throw new Error('Failed to fetch category tree');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching category tree:', error);
            return [];
        }
    }
}

export default CategoryService;
