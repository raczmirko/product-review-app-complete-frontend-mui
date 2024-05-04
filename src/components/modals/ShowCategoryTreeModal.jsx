import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CategoryService from '../../services/CategoryService';
import CategoryTreeRenderer from '../CategoryTreeRenderer';


const ShowCategoryTreeModal = ({ categoryTreeId, closeFunction, isOpen, setIsOpen }) => {

    const [categoryTree, setCategoryTree] = useState([]);
    const [currentCategoryName, setCurrentCategoryName] = useState([]);

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    useEffect(() => {
        // Clear tree when component mounts
        setCategoryTree(undefined);
        setCurrentCategoryName(undefined);
        // Fetch category tree when the component mounts
        if (categoryTreeId != undefined) {
            CategoryService.fetchCategoryTree(categoryTreeId)
            .then(data => {
                // Extract the currentCategory from the data
                const { currentCategory } = data;
                setCurrentCategoryName(currentCategory.name);
                setCategoryTree(data);
            })
            .catch(error => console.error('Error:', error));
        }
    }, [isOpen]);

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="create-brand-modal"
            aria-describedby="modal-to-create-brand"
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
                    outline: '1px solid #81be83'
                }}
            >
                <Typography variant="h5" component="div" gutterBottom>Category tree for '{currentCategoryName}'</Typography>
                <Box sx={{ height: 220, flexGrow: 1, maxWidth: 400 }}>
                    {/* Call the renderCategoryTree function with the categoryTree and subSubcategories */}
                    {CategoryTreeRenderer(categoryTree)}
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ShowCategoryTreeModal;
