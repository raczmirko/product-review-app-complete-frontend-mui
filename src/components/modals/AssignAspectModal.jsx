import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CategoryService from '../../services/CategoryService';

const AssignAspectModal = ({ categoryId, closeFunction, createEntityFunction, isOpen, setIsOpen }) => {
    const [name, setName] = useState('');
    const [question, setQuestion] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        setCategory(undefined);
        if (categoryId !== undefined) {
            CategoryService.getCategory(categoryId)
            .then(data => {
                setCategory(data);
            })
            .catch(error => console.error('Error:', error));
        }
    }, [isOpen]);

    useEffect(() => {
        if(name !== undefined && name !== ''){
            setQuestion(`How would you rate the product's ${name.toLowerCase()}?`);
        }
    }, [name]);

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
        setName(undefined);
        setQuestion(undefined);
    }

    const handleCreate = (e) => {
        e.preventDefault();
        createEntityFunction(name, question, category);
        handleClose();
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="assign-aspect-modal"
            aria-describedby="modal-to-assign-aspect"
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
                <Typography variant="h5" component="div" gutterBottom>Create new aspect for '{category && category.name}'</Typography>
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
                    <TextField
                        label="Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        variant="outlined"
                        autoFocus
                        fullWidth
                        multiline
                        rows={4}
                        required
                        inputProps={{ maxLength: 100 }}
                        sx={{ mb: 2 }}
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

export default AssignAspectModal;
