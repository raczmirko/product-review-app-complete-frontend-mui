import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import BrandSelector from '../selectors/BrandSelector';
import CategorySelector from "../selectors/CategorySelector";

const CreateArticleModal = ({ closeFunction, createEntityFunction, isOpen, setIsOpen }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');

    const handleCategorySelect = (category) => {
        setCategory(category)
    }

    const handleBrandSelect = (brand) => {
        setBrand(brand)
    }

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    const handleCreate = (e) => {
        e.preventDefault();
        createEntityFunction(name, category, brand, description);
        setName(undefined);
        setCategory(undefined);
        setBrand(undefined);
        setDescription(undefined);
        handleClose();
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="create-article-modal"
            aria-describedby="modal-to-create-article"
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
                <Typography variant="h5" component="div" gutterBottom>New article</Typography>
                <form onSubmit={handleCreate}>
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
                    <CategorySelector selectedCategory={category} setSelectedCategory={setCategory} selectorType='leaf'/>
                    <BrandSelector selectedBrand={brand} setSelectedBrand={setBrand}/>
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
                        <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>Create</Button>
                        <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateArticleModal;
