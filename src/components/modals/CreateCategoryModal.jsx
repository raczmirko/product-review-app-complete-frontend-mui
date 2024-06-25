import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import ModalButton from '../buttons/ModalButton';
import CategorySelector from "../selectors/CategorySelector";

const CreateCategoryModal = ({ closeFunction, createEntityFunction, isOpen, setIsOpen }) => {
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [description, setDescription] = useState('');

    const handleCategorySelect = (category) => {
        setParentCategory(category)
    }

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    const handleCreate = (e) => {
        e.preventDefault();
        createEntityFunction(name, parentCategory, description);
        setName(undefined);
        setParentCategory(undefined);
        setDescription(undefined);
        handleClose();
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="create-category-modal"
            aria-describedby="modal-to-create-category"
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
                <Typography variant="h5" component="div" gutterBottom>New category</Typography>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        autoFocus
                        fullWidth
                        required
                        inputProps={{ maxLength: 100 }}
                        sx={{ mb: 2 }}
                    />
                    <CategorySelector selectedCategory={parentCategory} setSelectedCategory={setParentCategory} selectorType='parent'/>
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 1000 }}
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                        <ModalButton buttonText='save' colorParam='success' onClickParam={handleCreate} />
                        <ModalButton buttonText='close' colorParam='secondary' onClickParam={handleClose} />
                    </Box>
            </Box>
        </Modal>
    );
};

export default CreateCategoryModal;
