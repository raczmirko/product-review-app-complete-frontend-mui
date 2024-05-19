import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import ArticleService from '../../services/ArticleService';
import DataDisplayTable from '../tables/DataDisplayTable';


const AssignPackagingModal = ({ articleId, closeFunction, isOpen, setIsOpen }) => {

    const [article, setArticle] = useState(undefined);
    const [articles, setArticles] = useState(undefined);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [filter, setFilter] = useState('');

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    useEffect(() => {
        setArticle(undefined);
        // Fetch all articles
        ArticleService.fetchArticles()
        .then(data => {
            setArticles(data);
            setFilteredArticles(data);
        })
        .catch(error => console.error('Error:', error));
        // If articleId is not null, fetch article
        if (articleId != undefined) {
            ArticleService.fetchArticleById(articleId)
            .then(data => {
                setArticle(data);
            })
            .catch(error => console.error('Error:', error));
        }
    }, [isOpen]);

    const filterArticles = (filter) => {
        setFilter(filter);
        const regex = new RegExp(filter, 'i'); // 'i' makes the search case-insensitive
        setFilteredArticles(articles.filter(item => regex.test(item.name) || regex.test(item.id)));
    }

    const resetFilter = () => {
        setFilter('');
        filterArticles('');
    }

    return (
        <>
        {article && articles &&
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="assign-packaging-modal"
                aria-describedby="modal-to-assign-packaging"
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
                    <Typography variant="h5" component="div" gutterBottom>Create a product of "{article.name}"</Typography>
                    <Box sx={{ flexGrow: 1 }}>
                        <DataDisplayTable data={filteredArticles}/>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                        <Box>
                            <TextField 
                                id='filterName'
                                label='Filter name'
                                name='name'
                                size='small'
                                value={filter}
                                onChange={(e) => filterArticles(e.target.value)}
                                sx={{ maxWidth: '300px' }}
                            />
                            <Button variant="contained" color="error" sx={{ ml: 1 }} onClick={(e) => resetFilter()}>Clear</Button>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={null}>Save</Button>
                            <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        }
        </>
    );
};

export default AssignPackagingModal;
