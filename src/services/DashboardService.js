import { apiRequest } from "./CrudService";

class DashboardService {
    static async getRecordAmounts() {
        const endpoint = `http://localhost:8080/dashboard/record-amounts`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getMostActiveUsers(userCount) {
        const endpoint = `http://localhost:8080/dashboard/most-active-users?userCount=${userCount}`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    }
}

export default DashboardService;