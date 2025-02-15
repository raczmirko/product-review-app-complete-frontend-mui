import { apiRequest } from "./CrudService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

class DashboardService {
    static async getRecordAmounts() {
        const endpoint = `${API_BASE_URL}/dashboard/record-amounts`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getMostActiveUsers(userCount) {
        const endpoint = `${API_BASE_URL}/dashboard/most-active-users?userCount=${userCount}`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getThisYearsReviews() {
        const endpoint = `${API_BASE_URL}/dashboard/reviews-this-year`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getUserRatingsPerCategory() {
        const endpoint = `${API_BASE_URL}/dashboard/user-reviews-per-category`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getUserBestRatedProducts() {
        const endpoint = `${API_BASE_URL}/dashboard/user-best-rated-products`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getBestRatedProductsPerBrand() {
        const endpoint = `${API_BASE_URL}/dashboard/view-most-popular-articles-per-brand`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getBestRatedProductsPerCategory() {
        const endpoint = `${API_BASE_URL}/dashboard/view-most-popular-articles-per-category`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getUserDomesticProductPercentage() {
        const endpoint = `${API_BASE_URL}/dashboard/user-domestic-product-percentage`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getWeakAspectsOfMostPopularProducts() {
        const endpoint = `${API_BASE_URL}/dashboard/weak-aspects-of-popular-products`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };

    static async getFavouriteBrandProductDistribution() {
        const endpoint = `${API_BASE_URL}/dashboard/favourite-brand-product-distribution`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        return result.data;
    };
}

export default DashboardService;