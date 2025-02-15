import { apiRequest } from "./CrudService";
import ProductImageService from "./ProductImageService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

class ProductService {
    static async createProductFull(article, packaging, characteristics, images) {
        if (packaging === '') {
            return { success: false, message: 'ERROR: Packaging cannot be empty.' };
        }

        try {
            // Create the product and get the product
            const response = await this.createProduct(article, packaging);

            if (response.success === true) {
                if (images.length > 0) {
                    // Create Product API returns the created product as message
                    ProductImageService.uploadProductImages(response.product.id, images);
                }
                this.assignProductCharacteristicValues(response.product, characteristics);
            }

            return { success: true, message: 'SUCCESS: Product created.' };
        }
        catch (error) {
            console.error('Error creating product:', error);
            return { success: false, message: error.message };
        }
    };

    static async createProduct(article, packaging) {
        const endpoint = `${API_BASE_URL}/product/create`;
        const requestBody = {
            article: article,
            packaging: packaging
        };

        const response = await apiRequest(endpoint, 'POST', requestBody);

        if (response.success) {
            let message = 'Product successfully created.';
            return { success: true, product: response.data, message: message };
        } else {
            return { success: false, message: response.message };
        }
    };

    static async assignProductCharacteristicValue(product, characteristic, value) {
        const endpoint = `${API_BASE_URL}/product-characteristic-value/create`;
        const requestBody = {
            product: product,
            characteristic: characteristic,
            value: value
        };

        const response = await apiRequest(endpoint, 'POST', requestBody);

        if (response.success) {
            let message = 'SUCCESS: Characteristics value(s) assigned.';
            return { success: true, productId: response.data, message: message };
        } else {
            return { success: false, message: response.message };
        }
    };

    static async assignProductCharacteristicValues(product, characteristicsList) {
        try {
            characteristicsList.forEach((characteristic) => {
                if (characteristic.value !== '') {
                    let char = characteristic;
                    let value = characteristic.value;
                    this.assignProductCharacteristicValue(product, char, value);
                }
            });
            return { success: true };
        }
        catch (error) {
            console.error('Error assigning characteristic values:', error);
            return { success: false, message: error.message };
        }
    };
}

export default ProductService;