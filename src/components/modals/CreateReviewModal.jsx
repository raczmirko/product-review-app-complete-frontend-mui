import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import CountrySelector from '../selectors/CountrySelector';

const CreateProductModal = ({ product, closeFunction, isOpen, setIsOpen, createReviewFunction, createReviewBodyFunction }) => {

    const [selectedPage, setSelectedPage] = useState('head');
    const [description, setDescription] = useState('');
    const [recommended, setRecommended] = useState(true);
    const [valueForPrice, setValueForPrice] = useState('');
    const [purchaseCountry, setPurchaseCountry] = useState('');

    const handlePageChange = (event, newPage) => {
        if (newPage !== null) {
            setSelectedPage(newPage);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    function truncateDescription(text) {
        if (text && text.length > 25) {
            return text.substring(0, 25) + '...';
        }
        return text;
    }

    const handleAlignment = (event, boolean) => {
        setRecommended(boolean);
    };

    const handleCreate = async () => {
        try {
            createReviewFunction(product, description, recommended, valueForPrice, purchaseCountry);
            handleClose();
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const renderSelectedPage = () => {
        switch (selectedPage) {
            case 'head':
                return (
                    <Box>
                        <Box sx={{ display: 'block' }}>
                            <Typography variant="h6">Value for price</Typography>
                            <Rating name="no-value" value={valueForPrice} onChange={(e) => setValueForPrice(e.target.value)}/>
                            <Typography variant="h6">Do you recommend the product?</Typography>
                            <ToggleButtonGroup
                                value={recommended}
                                exclusive
                                aria-label="text alignment"
                                >
                                <ToggleButton value={false} onClick={() => setRecommended(false)}>
                                    <ThumbDownIcon color='error'/>
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="overline">NO</Typography>
                                    </Box>
                                </ToggleButton>
                                <ToggleButton value={true} onClick={() => setRecommended(true)}>
                                    <ThumbUpIcon color='success'/>
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="overline">YES</Typography>
                                    </Box>
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <Typography variant="h6" sx={{ mb: 2 }}>In what country did you buy this product?</Typography>
                            <CountrySelector selectedCountry={purchaseCountry} setSelectedCountry={setPurchaseCountry} isRequired='true'/>
                        </Box>
                        <TextField
                            label="Overall review"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            inputProps={{ maxLength: 1000 }}
                            sx={{ mt: 2, mb: 2 }}
                        />
                    </Box>
                );
            case 'body':
                return (
                    <Box>
                        
                    </Box>
                );
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="review-modal"
            aria-describedby="modal-to-create-review"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '75%',
                    minWidth: '30%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    outline: '1px solid #81be83',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h5" component="div" gutterBottom>Create a review of "{product.article.name}"</Typography>
                <hr/>
                <Typography variant="subtitle1" component="div" gutterBottom>
                    lorem ipsum.
                </Typography>
                <hr/>
                <ToggleButtonGroup
                    value={selectedPage}
                    exclusive
                    onChange={handlePageChange}
                    aria-label="page selection"
                >
                    <ToggleButton value="head" aria-label="review-head">
                        Overall review
                    </ToggleButton>
                    <ToggleButton value="body" aria-label="review-body">
                        Review by aspects
                    </ToggleButton>
                </ToggleButtonGroup>
                <hr />
                <Box sx={{ minHeight: 250 }}>
                    {renderSelectedPage()}
                </Box>
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={handleCreate}>Save</Button>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateProductModal;
