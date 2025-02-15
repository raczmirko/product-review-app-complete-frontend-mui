import { apiRequest } from "./CrudService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

class ProductCharacteristicValueService {
    static async findAllByProductId(productId) {
        const endpoint = `${API_BASE_URL}/product-characteristic-value/${productId}/all`;
        const requestBody = undefined;

        const result = await apiRequest(endpoint, 'GET', requestBody);

        if (result.success) {
            return { success: true, data: result.data };
        } else {
            return { success: false };
        }
    }
}

export default ProductCharacteristicValueService;
