import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import CountrySelector from "../CountrySelector";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CreateCountryModal = ({ closeFunction, createEntityFunction, isOpen, setIsOpen }) => {
    const [name, setName] = useState('');
    const [countryCode, setCountryCode] = useState('');

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    const handleCreate = (e) => {
        e.preventDefault();
        createEntityFunction(countryCode, name);
        handleClose();
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="create-country-modal"
            aria-describedby="modal-to-create-country"
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
                    outline: '1px solid #81be83'
                }}
            >
                <Typography variant="h5" component="div" gutterBottom>New country</Typography>
                <form onSubmit={handleCreate}>
                    <TextField
                        label="Country Code"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                        rows={4}
                        inputProps={{ maxLength: 3 }}
                        sx={{ mt: 2, mb: 2 }}
                    />
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
                    <Box sx={{ textAlign: 'right' }}>
                        <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>Create</Button>
                        <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateCountryModal;
