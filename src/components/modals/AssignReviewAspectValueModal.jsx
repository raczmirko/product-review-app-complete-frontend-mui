import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import AspectService from '../../services/AspectService';

const AssignReviewAspectValueModal = ({ review, isOpen, setIsOpen, createReviewBody }) => {

    const [aspects, setAspects] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        AspectService.fetchAspectsByCategory(review.product.article.category.id)
        .then(response => {
            const fetchedAspects = response.data.map(aspect => ({
                ...aspect,
                score: 0
            }));
            setAspects(fetchedAspects);
            initAspectScores(review, fetchedAspects);
        })
        .catch(error => console.error('Error fetching review aspects:', error))
        .finally(() => setIsLoaded(true))
    }, [review]);

    function initAspectScores(review, aspects) {
        review.reviewBodyItems.forEach(item => {
            const aspect = aspects.find(aspect => aspect.id === item.id.aspectId);
            if (aspect) {
                assignScoreToAspect(aspect.id, item.score);
            }
        });
    };

    const handleClose = () => {
        setIsOpen(false);
    };
    
    const handleSave = () => {
        createReviewBody(review.product, aspects);
        setIsOpen(false);
    };

    const assignScoreToAspect = (aspectId, score) => {
        setAspects(prevAspects => prevAspects.map(aspect =>
            aspect.id === aspectId ? { ...aspect, score: score } : aspect
        ));
    };

    const assignUpdateFlagToAspect = (aspectId, score) => {
        setAspects(prevAspects => prevAspects.map(aspect =>
            aspect.id === aspectId ? { ...aspect, updated: true } : aspect
        ));
    };

    const handleModification = (aspectId, score) => {
        assignScoreToAspect(aspectId, score);
        assignUpdateFlagToAspect(aspectId, score);
    };

    return (
        <>
            {isLoaded &&
                <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="assign-review-aspect-value-modal"
                aria-describedby="modal-to-assign-review-aspect-value"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '30%',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            outline: '1px solid #81be83',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h5" component="div" gutterBottom>Modify aspect scores for '{review.product.article.name}'</Typography>
                        <Box sx={{ overflowY: 'auto', maxHeight: '400px' }}>
                            {aspects.length > 0 && aspects.map(aspect => (
                                <Box key={aspect.id}>
                                    <Typography variant="h6">{aspect.name}?</Typography>
                                    <Rating size="large" value={aspect.score} onChange={(e, newValue) => handleModification(aspect.id, newValue)} />
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                            <Button type="submit" variant="contained" color="success" sx={{ mr: 1 }} onClick={handleSave}>Save</Button>
                            <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                        </Box>
                    </Box>
                </Modal>
            }
        </>
    );
};

export default AssignReviewAspectValueModal;
