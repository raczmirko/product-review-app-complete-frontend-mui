import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Modal from '@mui/material/Modal';
import * as React from 'react';

export default function GalleryModal({ images, closeFunction, isOpen, setIsOpen }) {

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

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
                    maxWidth: '75%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    outline: '1px solid #81be83',
                    textAlign: 'center'
                }}
            >
                <ImageList sx={{ width: 800, height: 600 }} cols={3} rowHeight={164}>
                    {images.map((item) => (
                        <ImageListItem key={item.id}>
                        <img
                            src={`data:image/png;base64,${item.image}`}
                            alt={item.title}
                            loading="lazy"
                        />
                        </ImageListItem>
                    ))}
                </ImageList>
                <Box sx={{ textAlign: 'right' }}>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
}