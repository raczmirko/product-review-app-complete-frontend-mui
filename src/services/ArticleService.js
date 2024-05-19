class ArticleService {
    static async fetchArticleById(id) {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await fetch(`http://localhost:8080/article/${id}`, {headers});
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
    }
}

export default ArticleService;
