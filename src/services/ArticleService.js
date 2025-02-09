const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

class ArticleService {
    static async fetchArticleById(id) {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`${API_BASE_URL}/article/${id}`, {headers});
            if (!response.ok) {
                throw new Error('Failed to fetch article.');
            }
            if (response.status === 204) {
                return [];
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            return [];
        }
    };

    static async fetchArticles() {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`${API_BASE_URL}/article/all`, {headers});
            if (!response.ok) {
                throw new Error('Failed to fetch articles.');
            }
            if (response.status === 204) {
                return [];
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
            return [];
        }
    }
}

export default ArticleService;
