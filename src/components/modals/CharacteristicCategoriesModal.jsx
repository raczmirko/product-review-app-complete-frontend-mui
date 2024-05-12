import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import renderAssignedCategoryTree from '../CharacteristicCategoryTreeRenderer';
import CharacteristicService from '../../services/CharacteristicService';


const ShowCharacteristicCategoriesModal = ({ characteristicId, closeFunction, isOpen, setIsOpen }) => {

    const [assignedCategoryTrees, setAssignedCategoryTrees] = useState([]);

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    useEffect(() => {
        // Clear tree when component mounts
        setAssignedCategoryTrees(undefined);
        // Fetch category tree when the component mounts
        if (characteristicId != undefined) {
            CharacteristicService.fetchAssignedCategoryTree(characteristicId)
            .then(data => {setAssignedCategoryTrees(data);})
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
                <Typography variant="h5" component="div" gutterBottom>Categories to which characteristic #{characteristicId} is assigned</Typography>
                <hr/>
                <Typography variant="p" component="div" gutterBottom>Subcategories inherit the characteristics of the parent categories. Categories that have the '>' symbol can be opened to view the hierarchy.</Typography>
                <hr/>
                <Box sx={{ height: 220, flexGrow: 1, maxWidth: 400 }}>
                    {/* Call the renderCategoryTree function with the categoryTree and subSubcategories */}
                    {renderAssignedCategoryTree(assignedCategoryTrees)}
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ShowCharacteristicCategoriesModal;