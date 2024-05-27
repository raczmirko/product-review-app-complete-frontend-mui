import { apiRequest } from "./CrudService";

class AspectService {
    static async fetchAspectsByCategory(categoryId) {
        const endpoint = `http://localhost:8080/aspect/${categoryId}/category-aspects`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);
        const data = await result.json();
    
        if (result.success) {
            return {success: true, data: data};
        } else {
            return {success: false};
        }
    }
}

export default AspectService;
