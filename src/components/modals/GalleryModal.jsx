import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/CrudService';
import ProductImageService from '../../services/ProductImageService';
import ImageUploadButton from '../buttons/ImageUploadButton';
import ModalButton from '../buttons/ModalButton';

export default function GalleryModal({ product, closeFunction, isOpen, setIsOpen }) {

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
    
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setImages(product.productImages);
    }, [product.productImages])

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    const fetchProduct = async (productId) => {
        const endpoint = `${API_BASE_URL}/product/${productId}`;
        const requestBody = undefined;
        const result = await apiRequest(endpoint, 'GET', requestBody);
        if(result.success) setImages(result.data.productImages);
    };

    const deleteProductImage = async (imageIndex) => {
        let imageId = images[imageIndex].id;
        const endpoint = `${API_BASE_URL}/product-image/${imageId}/delete`;
        const requestBody = undefined;
        const result = await apiRequest(endpoint, 'POST', requestBody);
        // Manually remove the image so that re-fetching all images is not neccessary
        if (result.success) {
            setImages((prevImages) => {
                const updatedImages = [...prevImages];
                updatedImages.splice(imageIndex, 1); // Remove the image at the specified index
                return updatedImages;
            });
        }
    };

    const uploadProductImages = async (productId, images) => {
        const response = await ProductImageService.uploadProductImages(productId, images);
        if (response.success) fetchProduct(product.id);
    };

    const handleFileChange = (event) => {
        if (event && event.target && event.target.files) {
            const fileArray = Array.from(event.target.files);
            const imageArray = fileArray.map((file) => {
                return URL.createObjectURL(file);
            });
            uploadProductImages(product.id, imageArray);
        } else {
            console.error('Event or event.target is undefined');
        }
    };

    const handleWheel = (e) => {
        const delta = e.deltaY > 0 ? -0.3 : 0.3;
        setZoomLevel((prevZoomLevel) => Math.min(Math.max(prevZoomLevel + delta, 1), 3));
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="list-aspects-modal"
            aria-describedby="modal-to-show-aspects"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxHeight: '75%',
                    minHeight: '50%',
                    maxWidth: '80%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 6,
                    outline: '1px solid #81be83',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                <Typography variant="h5" component="div" gutterBottom>
                    Product Images
                </Typography>
                <Box sx={{ display: 'flex', flexGrow: 1, overflowY: 'auto' }}>
                    <Box sx={{ width: '60%', overflowY: 'auto', mr: 2 }}>
                        <ImageList cols={3} gap={12}>
                            {images.map((item, index) => (
                                <ImageListItem
                                    key={item.id}
                                    sx={{ position: 'relative',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(0.9)',
                                            zIndex: 999,
                                            '& .magnifyIcon': {
                                                display: 'block',
                                            },
                                        },
                                    }}
                                >
                                    <img
                                        src={`data:image/png;base64,${item.image}`}
                                        alt={item.title}
                                        loading="lazy"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            zIndex: 1,
                                            bg: 'red',
                                        }}
                                        onClick={() => deleteProductImage(index)}
                                    >
                                        X
                                    </Button>
                                    <Button
                                        className="magnifyIcon"
                                        onClick={() => setSelectedImage(item.image)}
                                        sx={{
                                            display: 'none',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 2,
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            },
                                        }}
                                    >
                                        <SearchIcon fontSize='large'/>
                                    </Button>
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                    {images.length > 0 && 
                        <Box
                            sx={{
                                width: '40%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid #ccc',
                                padding: 2,
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onWheel={handleWheel}
                        >
                            {selectedImage ? (
                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative', 
                                    width: '100%', 
                                    height: '100%' 
                                }}>
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            position: 'absolute', 
                                            zIndex: 999,
                                            top: 0, 
                                            width: '100%', 
                                            textAlign: 'center', 
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)' 
                                        }}
                                    >
                                        Image preview
                                    </Typography>
                                    <img
                                        src={`data:image/png;base64,${selectedImage}`}
                                        alt="Selected"
                                        style={{
                                            width: '80%',
                                            maxHeight: '100%',
                                            transform: `scale(${zoomLevel})`,
                                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                            transition: 'transform 0.1s',
                                        }}
                                    />
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            position: 'absolute', 
                                            zIndex: 999,
                                            bottom: 0, 
                                            width: '100%', 
                                            textAlign: 'center', 
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)' 
                                        }}
                                    >
                                        Zoom by scrolling with the mouse wheel.
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="h6">Hover over an image and click the magnifying glass to view</Typography>
                            )}
                        </Box>
                    }
                    </Box>
                <Box sx={{ textAlign: 'right', mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <ImageUploadButton handleFileChange={handleFileChange} />
                    <ModalButton buttonText='close' colorParam='secondary' onClickParam={handleClose} />
                </Box>
            </Box>
        </Modal>
    );
}