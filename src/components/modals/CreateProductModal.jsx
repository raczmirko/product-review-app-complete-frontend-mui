import LinkIcon from '@mui/icons-material/Link';
import { Card, CardContent, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import ArticleService from '../../services/ArticleService';
import PackagingService from '../../services/PackagingService';
import PackagingSelector from '../selectors/PackagingSelector';
import DataDisplayTable from '../tables/DataDisplayTable';

const CreateProductModal = ({ articleId, closeFunction, isOpen, setIsOpen, createFunction }) => {

    const [article, setArticle] = useState('');
    const [packaging, setPackaging] = useState('');
    const [packagings, setPackagings] = useState([]);
    const [filteredPackagings, setFilteredArticles] = useState([]);
    const [filter, setFilter] = useState('');

    const [selectedPage, setSelectedPage] = useState('structure');

    const handlePageChange = (event, newPage) => {
        if (newPage !== null) {
            setSelectedPage(newPage);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    function resetVariables() {
        setArticle('');
        setPackaging('');
        setPackagings([]);
        setFilteredArticles([]);
        setFilter('');
    }

    useEffect(() => {
        resetVariables();
        // Fetch all articles
        PackagingService.fetchPackagings()
        .then(data => {
            setPackagings(data);
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
        setFilteredArticles(packagings.filter(item => regex.test(item.name) || regex.test(item.id)));
    }

    const resetFilter = () => {
        setFilter('');
        filterArticles('');
    }

    function truncateDescription(text) {
        if (text && text.length > 25) {
            return text.substring(0, 25) + '...';
        }
        return text;
    }

    const handleCreate = () => {
        createFunction(article, packaging);
        handleClose();
    }

    const renderSelectedPage = () => {
        switch (selectedPage) {
            case 'structure':
                return (
                    <Box>
                        <Typography variant="subtitle2" component="div" gutterBottom>
                            Product structure:
                        </Typography>
                        <Grid container spacing={2} alignItems="center" justifyContent="center" direction={{ xs: 'column', sm: 'row', md: 'row', lg: 'row' }}>
                            <Grid item xs={12} md={5}>
                                {article && (
                                    <Card sx={{ minWidth: 275, backgroundColor: '#81BE83', padding: 2, overflow: 'auto' }}>
                                        <CardContent>
                                            <Typography variant="h5" color="black" gutterBottom>{article.name}</Typography>
                                            <Typography variant="body2" color="black">ID: {article.id}</Typography>
                                            <Typography variant="body2" color="black">Brand: {article.brand.name}</Typography>
                                            <Typography variant="body2" color="black">Category: {article.category.name}</Typography>
                                            <Typography variant="body2" color="black">Description: {truncateDescription(article.description)}</Typography>
                                        </CardContent>
                                    </Card>
                                )}
                            </Grid>
                            <Grid item xs={12} md={1} container justifyContent="center">
                                <LinkIcon fontSize="large" />
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <PackagingSelector selectedPackaging={packaging} setSelectedPackaging={setPackaging} />
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 'images':
                return (
                    <Box>
                        <Typography variant="subtitle2" component="div" gutterBottom>
                            Product Images
                        </Typography>
                        {/* Your Product Images component or content goes here */}
                    </Box>
                );
            case 'characteristics':
                return (
                    <Box>
                        <Typography variant="subtitle2" component="div" gutterBottom>
                            Product Characteristics
                        </Typography>
                        {/* Your Product Characteristics component or content goes here */}
                    </Box>
                );
        }
    }

    return (
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
                <hr/>
                <Typography variant="subtitle1" component="div" gutterBottom>
                    An article is the theorical product. Products are made up of the combination of an article and a packaging type. 
                    One article may be available in many different packaging options, resulting in many products of the same article.
                </Typography>
                <hr/>
                <ToggleButtonGroup
                    value={selectedPage}
                    exclusive
                    onChange={handlePageChange}
                    aria-label="page selection"
                >
                    <ToggleButton value="structure" aria-label="product structure">
                        Structure
                    </ToggleButton>
                    <ToggleButton value="images" aria-label="product images">
                        Images
                    </ToggleButton>
                    <ToggleButton value="characteristics" aria-label="product characteristics">
                        Characteristics
                    </ToggleButton>
                </ToggleButtonGroup>
                <hr />
                <Box sx={{ minHeight: 250 }}>
                    {renderSelectedPage()}
                </Box>
                <hr />
                <Typography variant="subtitle2" component="div" gutterBottom>Available packaging options:</Typography>
                <hr/>
                <Box sx={{ flexGrow: 1 }}>
                    <DataDisplayTable data={filteredPackagings} maxHeight={210}/>
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
                        <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={(e) => handleCreate()}>Save</Button>
                        <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateProductModal;
