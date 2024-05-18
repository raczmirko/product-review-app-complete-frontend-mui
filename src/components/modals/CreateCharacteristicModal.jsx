import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CreateCharacteristicModal = ({ closeFunction, createEntityFunction, isOpen, setIsOpen }) => {
    const [name, setName] = useState('');
    const [unitOfMeasure, setUnitOfMeasure] = useState('');
    const [unitOfMeasureName, setUnitOfMeasureName] = useState('');
    const [description, setDescription] = useState('');

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
        setName(undefined);
        setUnitOfMeasure(undefined);
        setUnitOfMeasureName(undefined);
        setDescription(undefined);
    }

    const handleCreate = (e) => {
        e.preventDefault();
        createEntityFunction(name, unitOfMeasure, unitOfMeasureName, description);
        handleClose();
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="create-characteristic-modal"
            aria-describedby="modal-to-create-characteristic"
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
                <Typography variant="h5" component="div" gutterBottom>New characteristic</Typography>
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
                        label="Unit of measure"
                        value={unitOfMeasure}
                        onChange={(e) => setUnitOfMeasure(e.target.value)}
                        variant="outlined"
                        fullWidth
                        inputProps={{ maxLength: 100 }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Unit of measure name"
                        value={unitOfMeasureName}
                        onChange={(e) => setUnitOfMeasureName(e.target.value)}
                        variant="outlined"
                        fullWidth
                        inputProps={{ maxLength: 100 }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={2}
                        inputProps={{ maxLength: 100 }}
                        sx={{ mb: 2 }}
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

export default CreateCharacteristicModal;
