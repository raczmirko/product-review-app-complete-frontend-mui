import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import CountrySelector from "../CountrySelector";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SendTimeExtension } from '@mui/icons-material';

const CreateBrandModal = ({ closeFunction, createBrandFunction }) => {
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');
    const [open, setOpen] = useState(true);

    const handleCountrySelect = (country) => {
        setCountry(country)
    }

    const handleClose = () => {
        setOpen(false);
        closeFunction();
    }

    const handleCreate = (e) => {
        e.preventDefault();
        createBrandFunction(name, country, description);
        handleClose();
    }

    return (
        <Modal
            open={open}
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
                    width: '50%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    outline: '1px solid #81be83'
                }}
            >
                <Typography variant="h5" component="div" gutterBottom>New brand</Typography>
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
                    <CountrySelector selectedCountry={country} setSelectedCountry={setCountry}/>
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 100 }}
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

export default CreateBrandModal;
