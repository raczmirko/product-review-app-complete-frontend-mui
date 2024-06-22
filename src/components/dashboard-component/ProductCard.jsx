import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import DashboardService from '../../services/DashboardService';
import CircularProgress from '@mui/material/CircularProgress';

const ProductCard = () => {
    const [products, setProducts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        DashboardService.getUserBestRatedProducts()
            .then(data => {
                setProducts(data);
                setIsLoaded(true);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
    };

    const currentProduct = products[currentIndex] || {};
    const currentImage = currentProduct.product?.productImages?.length > 0
        ? `data:image/png;base64,${currentProduct.product.productImages[0].image}`
        : null;

    return (
        isLoaded ? (
            <Card sx={{ outline: 1, outlineColor: '#81BE83', p: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Avatar 
                        sx={{ width: 140, height: 140 }}
                        src={currentImage}
                        alt="Product Image"
                    >
                        {!currentImage && <ImageNotSupportedIcon />}
                    </Avatar>
                    <Typography variant="h4" component="div">{currentProduct?.rank ? `N#${currentProduct.rank}` : 'N/A'}</Typography>
                </Box>
                <CardContent>
                <Typography variant="subtitle2" component="div">
                        ID: {currentProduct.product?.id || 'N/A'}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {currentProduct.product?.article?.name || 'No favourite yet'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    Overall rating average: {currentProduct?.scoreAverage ? `${currentProduct.scoreAverage}/10` : 'N/A'}
                    </Typography>
                </CardContent>
                <Box display="flex" justifyContent="space-between" p={2}>
                    <Button variant="contained" onClick={handlePrevious}>
                        Previous
                    </Button>
                    <Button variant="contained" onClick={handleNext}>
                        Next
                    </Button>
                </Box>
            </Card>
        ) : <CircularProgress />
    );
}

export default ProductCard;
