import { apiRequest } from "./CrudService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

class AspectService {
    static async fetchAspectsByCategory(categoryId) {
        const endpoint = `${API_BASE_URL}/aspect/${categoryId}/category-aspects`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);
    
        if (result.success) {
            return {success: true, data: result.data};
        } else {
            return {success: false};
        }
    }

    static async fetchAspects() {
        const endpoint = `${API_BASE_URL}/aspect/all`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);
    
        if (result.success) {
            return {success: true, data: result.data};
        } else {
            return {success: false};
        }
    }
}

export default AspectService;
