import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/CrudService';
import ProductImageService from '../../services/ProductImageService';

export default function GalleryModal({ product, closeFunction, isOpen, setIsOpen }) {
    
    const [images, setImages] = useState([]);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    useEffect(() => {
        setImages(product.productImages);
    }, [])

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    const fetchProduct = async (productId) => {
        const endpoint = `http://localhost:8080/product/${productId}`;
        const requestBody = undefined;
        const result = await apiRequest(endpoint, 'GET', requestBody);
        if(result.success) setImages(result.data.productImages);
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

    const handleRemoveImage = (index) => {
        setImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages.splice(index, 1); // Remove the image at the specified index
            return updatedImages;
        });
    };

    const renderImageUploadButton = () => {
        return (
            <Button
                component="label"
                role={undefined}
                variant="contained"
                color="success"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{ mr: 1 }}
            >
                Upload file
                <VisuallyHiddenInput type="file" multiple onChange={(e) => handleFileChange(e)} />
            </Button>
        );
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
                    width: '80%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    outline: '1px solid #81be83',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                <Typography variant="h5" component="div" gutterBottom>
                    Product Images
                </Typography>
                <Box sx={{ overflowY: 'auto', marginBottom: 3 }}>
                    <ImageList cols={4} >
                        {images.map((item, index) => (
                            <ImageListItem key={item.id} sx={{ m: 1, maxWidth: '300px', maxHeight: 'auto' }}>
                            <img
                                src={`data:image/png;base64,${item.image}`}
                                alt={item.title}
                                loading="lazy"
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
                                onClick={() => handleRemoveImage(index)}
                            >
                                X
                            </Button>
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                    {renderImageUploadButton()}
                    <Button variant="contained" color="error" onClick={handleClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
}