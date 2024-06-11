import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useState, useEffect } from 'react';
import AspectService from '../../services/AspectService';

const ViewReviewModal = ({ review, isOpen, setIsOpen }) => {

    const [aspects, setAspects] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        AspectService.fetchAspects()
            .then(response => {
                setAspects(response.data);
                setIsLoaded(true);
            })
            .catch(error => console.error('Error fetching review aspects:', error));
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    }

    const formatDate = function(dateString) {
        const dateStr = dateString;
        const date = new Date(dateStr);

        // Define options for formatting the date
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
        }

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedDate;
    };

    return (
        <>
            {isLoaded &&
                <Modal
                    open={isOpen}
                    onClose={handleClose}
                    aria-labelledby="view-review-modal"
                    aria-describedby="modal-view-review"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '50%',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            outline: '1px solid #81be83',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h5" component="div" gutterBottom>
                            Review of '{review.product.article.name}'
                        </Typography>
                        <Divider textAlign="left" sx={{ mb: 1 }}><Chip label="General information" size="small" /></Divider>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="subtitle1" component="div" sx={{ mr: 1 }}>
                                Value for price:
                            </Typography>
                            <Rating value={review.valueForPrice} readOnly size='large'></Rating>
                        </Box>
                        <Typography variant="subtitle1" component="div" sx={{ mr: 1 }}>
                            Purchase country: {review.purchaseCountry.name}
                        </Typography>
                        <Divider textAlign="left" sx={{ mb: 1 }}><Chip label="Aspects" size="small" /></Divider>
                        <Box sx={{ overflowY: 'auto', maxHeight: '300px' }}>
                            <Typography variant="subtitle1" component="div" gutterBottom>
                            {review.reviewBodyItems.map((item, index) => {
                                const aspect = aspects.find(aspect => aspect.id === item.id.aspectId);
                                return (
                                    <Box key={index} sx={{ overflowY: 'auto', maxHeight: '200px' }}>
                                        <Typography variant="subtitle1" component="div" gutterBottom>{aspect.name}</Typography>
                                        <Rating readOnly value={item.score} />
                                    </Box>
                                );
                            })}
                            </Typography>
                        </Box>
                        <Divider textAlign="left" sx={{ mb: 1 }}><Chip label="Review text" size="small" /></Divider>
                        <Box sx={{ overflowY: 'auto', maxHeight: '200px' }}>
                            <Typography variant="subtitle1" component="div" gutterBottom>
                                {review.description}
                            </Typography>
                        </Box>
                        <Divider textAlign="left" sx={{ mb: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" component="div" gutterBottom>
                                Written by {review.user.username}
                            </Typography>
                            <Typography variant="subtitle1" component="div" gutterBottom>
                            Last modified on {formatDate(review.date)}.
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                            <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                        </Box>
                    </Box>
                </Modal>
            }
        </>
    );
};

export default ViewReviewModal;
