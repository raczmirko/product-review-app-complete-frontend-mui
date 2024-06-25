import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import AspectService from '../../services/AspectService';
import ModalButton from '../buttons/ModalButton';
import CountrySelector from '../selectors/CountrySelector';

const CreateProductModal = ({ product, closeFunction, isOpen, setIsOpen, createReviewFunction, createReviewBodyFunction }) => {
    const [selectedPage, setSelectedPage] = useState('head');
    const [description, setDescription] = useState('');
    const [recommended, setRecommended] = useState(true);
    const [valueForPrice, setValueForPrice] = useState(5);
    const [purchaseCountry, setPurchaseCountry] = useState('');
    const [reviewAspects, setReviewAspects] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        AspectService.fetchAspectsByCategory(product.article.category.id)
            .then(response => {
                setReviewAspects(response.data.map(aspect => ({
                    ...aspect,
                    score: 0
                })));
            })
            .catch(error => console.error('Error fetching review aspects:', error));
    }, []);

    const assignScoreToAspect = (aspectId, score) => {
        setReviewAspects(prevAspects => prevAspects.map(aspect =>
            aspect.id === aspectId ? { ...aspect, score: score } : aspect
        ));
    };

    const handlePageChange = (event, newPage) => {
        if (newPage !== null) {
            setSelectedPage(newPage);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    };

    const handleCreate = async () => {
        const newErrors = {};
        if (!description) newErrors.description = 'Description is required';
        if (!purchaseCountry) newErrors.purchaseCountry = 'Purchase country is required';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            const response = await createReviewFunction(product, description, recommended, valueForPrice, purchaseCountry);
            if (response.success === true) {
                createReviewBodyFunction(product, reviewAspects);
            }
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
                            <Rating
                                size="large"
                                value={valueForPrice}
                                onChange={(e) => setValueForPrice(Number(e.target.value))}
                            />
                            <Typography variant="h6">Do you recommend the product?</Typography>
                            <ToggleButtonGroup
                                value={recommended}
                                exclusive
                                aria-label="text alignment"
                            >
                                <ToggleButton value={false} onClick={() => setRecommended(false)}>
                                    <ThumbDownIcon fontSize="large" color='error' />
                                    <Box sx={{ ml: 1 }}>
                                        <Typography fontSize="large" variant="overline">NO</Typography>
                                    </Box>
                                </ToggleButton>
                                <ToggleButton value={true} onClick={() => setRecommended(true)}>
                                    <ThumbUpIcon fontSize="large" color='success' />
                                    <Box sx={{ ml: 1 }}>
                                        <Typography fontSize="large" variant="overline">YES</Typography>
                                    </Box>
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <Typography variant="h6" sx={{ mb: 2 }}>In what country did you buy this product?</Typography>
                            <CountrySelector
                                selectedCountry={purchaseCountry}
                                setSelectedCountry={setPurchaseCountry}
                                isRequired={true}
                            />
                            {errors.purchaseCountry && (
                                <Typography variant="body2" color="error">{errors.purchaseCountry}</Typography>
                            )}
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
                            required
                        />
                        {errors.description && (
                            <Typography variant="body2" color="error">{errors.description}</Typography>
                        )}
                    </Box>
                );
            case 'body':
                return (
                    <Box>
                        {reviewAspects.length > 0 ?
                            <Typography variant="h6" gutterBottom>How would you rate the product's...</Typography>
                            :
                            <Typography variant="h6" gutterBottom>There are no review aspects associated to the parent categories.</Typography>
                        }
                        {reviewAspects.length > 0 && reviewAspects.map(aspect => (
                            <Box key={aspect.id} sx={{ overflowY: 'auto', maxHeight: '400px' }}>
                                <Typography variant="h6">{aspect.name}?</Typography>
                                <Rating size="large" value={aspect.score} onChange={(e, newValue) => assignScoreToAspect(aspect.id, newValue)} />
                            </Box>
                        ))}
                    </Box>
                );
        }
    };

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
                    width: '30%',
                    minWidth: '400px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    outline: '1px solid #81be83',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h5" component="div" gutterBottom>Create a review of "{product.article.name}"</Typography>
                <hr />
                <Typography variant="subtitle1" component="div" gutterBottom>
                    Create an overall review additionally with review by aspects. Aspects are inherited from parent categories.
                </Typography>
                <hr />
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
                <Box sx={{ minHeight: 250, mt: 2 }}>
                    {renderSelectedPage()}
                </Box>
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <ModalButton buttonText='save' colorParam='success' onClickParam={handleCreate} />
                    <ModalButton buttonText='close' colorParam='secondary' onClickParam={handleClose} />
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateProductModal;
