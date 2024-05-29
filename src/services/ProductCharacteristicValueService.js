import { apiRequest } from "./CrudService";

class ProductCharacteristicValueService {
    static async findAllByProductId(productId) {
        const endpoint = `http://localhost:8080/product-characteristic-value/${productId}/all`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);
    
        if (result.success) {
            return {success: true, data: result.data};
        } else {
            return {success: false};
        }
    }
}

export default ProductCharacteristicValueService;
