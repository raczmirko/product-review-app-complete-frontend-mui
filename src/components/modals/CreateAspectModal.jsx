import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import CategorySelector from "../selectors/CategorySelector";

const CreateAspectModal = ({ closeFunction, createEntityFunction, isOpen, setIsOpen }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [question, setQuestion] = useState('');

    const handleCategorySelect = (category) => {
        setCategory(category)
    }

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    const handleCreate = (e) => {
        e.preventDefault();
        createEntityFunction(name, question, category);
        setName(undefined);
        setCategory(undefined);
        setQuestion(undefined);
        handleClose();
    }

    useEffect(() => {
        if(name !== undefined && name !== ''){
            setQuestion(`How would you rate the product's ${name.toLowerCase()}?`);
        }
    }, [name]);

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="create-aspect-modal"
            aria-describedby="modal-to-create-aspect"
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
                <Typography variant="h5" component="div" gutterBottom>New aspect</Typography>
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
                    <CategorySelector selectedCategory={category} setSelectedCategory={setCategory} selectorType='all'/>
                    <TextField
                        label="Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 100 }}
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                        <Button type="submit" variant="contained" color="success" sx={{ mr: 1 }}>Create</Button>
                        <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateAspectModal;
