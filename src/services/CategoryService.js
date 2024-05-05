class CategoryService {
    static async fetchCategories() {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch('http://localhost:8080/category/all', {headers});
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

    static async fetchCategoryTree(id) {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`http://localhost:8080/category-hierarchy/${id}`, {headers});
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
