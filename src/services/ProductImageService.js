const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

class ProductImageService {
    static async uploadProductImages(productId, images) {       
        const formData = new FormData();

        await Promise.all(images.map(async (imageUrl, index) => {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `image${index}.jpg`, { type: blob.type });
            formData.append('files', file);
        }));

        // Log the FormData object to verify
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        try {
            const endpoint = `${API_BASE_URL}/product-image/${productId}/upload`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: formData
            });
            if (response.ok) {
                return { success: true, message: "Upload successful." };
            }
            else {
                console.error('Failed to upload images.');
                return { success: false, message: "Failed to upload images." };
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            return { success: false, data: undefined };
        }
    };
}

export default ProductImageService;