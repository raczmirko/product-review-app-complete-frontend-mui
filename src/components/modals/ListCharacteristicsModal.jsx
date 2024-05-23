import StyleIcon from '@mui/icons-material/Style';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import ArticleService from '../../services/ArticleService';
import CharacteristicService from '../../services/CharacteristicService';


const ListCharacteristicsModal = ({ articleId, closeFunction, isOpen, setIsOpen }) => {

    const [characteristics, setCharacteristics] = useState([]);
    const [article, setArticle] = useState([]);

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    useEffect(() => {
        if (articleId !== undefined) {
            // Fetch article first
            ArticleService.fetchArticleById(articleId)
            .then(article => {
                setArticle(article);
                // Then fetch characteristics by article's category
                CharacteristicService.listInheritedCharacteristics(article.category.id)
                .then(data => {
                    setCharacteristics(data);
                })
                .catch(error => console.error('Error:', error));
            })
        }
    }, [isOpen]);

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="list-characteristics-modal"
            aria-describedby="modal-to-show-inherited-characteristics"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '30%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    outline: '1px solid #81be83',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h5" component="div" gutterBottom>Characteristics of '{article.name}' inherited from its parent categories:</Typography>
                <Box sx={{ height: 220, overflowY: 'auto', maxWidth: 400 }}>
                    {characteristics.length > 0 ?
                        <List>
                            {characteristics.map((characteristic) => (
                                <ListItem key={characteristic.id}>
                                    <ListItemIcon>
                                        <StyleIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={characteristic.name}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        :
                        <Typography>No characteristics are inherited.</Typography>
                    }
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ListCharacteristicsModal;
