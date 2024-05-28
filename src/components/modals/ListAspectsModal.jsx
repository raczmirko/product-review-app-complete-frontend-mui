import QuizIcon from '@mui/icons-material/Quiz';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import AspectService from '../../services/AspectService';
import CategoryService from '../../services/CategoryService';

const ListAspectsModal = ({ categoryId, closeFunction, isOpen, setIsOpen }) => {
    const [aspects, setAspects] = useState([]);
    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    useEffect(() => {
        if (isOpen && categoryId !== undefined) {
            setLoading(true);
            Promise.all([
                CategoryService.getCategory(categoryId)
                    .then(data => setCategory(data)),
                AspectService.fetchAspectsByCategory(categoryId)
                    .then(result => setAspects(result.data))
            ])
            .catch(error => console.error('Error:', error))
            .finally(() => setLoading(false));
        }
    }, [isOpen, categoryId]);

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
                    maxWidth: '30%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    outline: '1px solid #81be83',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h5" component="div" gutterBottom>
                    Review aspects of '{category.name}':
                </Typography>
                <Typography variant="subtitle2" component="div" gutterBottom>
                    (Inherited from the category structure)
                </Typography>
                <Box sx={{ height: 220, overflowY: 'auto', maxWidth: 400 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        aspects.length > 0 ? (
                            <List>
                                {aspects.map((aspect) => (
                                    <ListItem key={aspect.id}>
                                        <ListItemIcon>
                                            <QuizIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={aspect.name} />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography>No aspects are assigned.</Typography>
                        )
                    )}
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ListAspectsModal;
