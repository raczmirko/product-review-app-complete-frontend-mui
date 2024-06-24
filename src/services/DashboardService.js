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
    };

    static async getThisYearsReviews() {
        const endpoint = `http://localhost:8080/dashboard/reviews-this-year`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getUserRatingsPerCategory() {
        const endpoint = `http://localhost:8080/dashboard/user-reviews-per-category`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getUserBestRatedProducts() {
        const endpoint = `http://localhost:8080/dashboard/user-best-rated-products`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getBestRatedProductsPerBrand() {
        const endpoint = `http://localhost:8080/dashboard/view-most-popular-articles-per-brand`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getBestRatedProductsPerCategory() {
        const endpoint = `http://localhost:8080/dashboard/view-most-popular-articles-per-category`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };
    
    static async getUserDomesticProductPercentage() {
        const endpoint = `http://localhost:8080/dashboard/user-domestic-product-percentage`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };
    
    static async getWeakAspectsOfMostPopularProducts() {
        const endpoint = `http://localhost:8080/dashboard/weak-aspects-of-popular-products`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };
}

export default DashboardService;