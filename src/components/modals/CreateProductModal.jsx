import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import { Card, CardContent, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import ToggleButton from '@mui/material/ToggleButton';
import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import ArticleService from '../../services/ArticleService';
import PackagingService from '../../services/PackagingService';
import CharacteristicService from '../../services/CharacteristicService';
import PackagingSelector from '../selectors/PackagingSelector';
import PackagingTable from '../tables/PackagingTable';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const CreateProductModal = ({ articleId, closeFunction, isOpen, setIsOpen, createFunction, uploadImageFunction, assignCharacteristicValueFunction }) => {

    const [article, setArticle] = useState('');
    const [packaging, setPackaging] = useState('');
    const [packagings, setPackagings] = useState([]);
    const [inheritedCharacteristics, setInheritedCharacteristics] = useState([]);
    const [characteristicAndValue, setCharacteristicAndValue] = useState([]);
    const [selectedPage, setSelectedPage] = useState('structure');
    const [showPackagingTable, setShowPackagingTable] = useState(false);
    const [images, setImages] = React.useState([]);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handlePageChange = (event, newPage) => {
        if (newPage !== null) {
            setSelectedPage(newPage);
        }
    };

    const handleFileChange = (event) => {
        if (event && event.target && event.target.files) {
            const fileArray = Array.from(event.target.files);
    
            const imageArray = fileArray.map((file) => {
                return URL.createObjectURL(file);
            });
    
            setImages(imageArray);
        } else {
            console.error('Event or event.target is undefined');
        }
    };

    const handleRemoveImage = (index) => {
        setImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages.splice(index, 1); // Remove the image at the specified index
            return updatedImages;
        });
    };

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    const togglePackagingComponent = () => {
        setShowPackagingTable((prevShow) => !prevShow);
    };

    useEffect(() => {
        PackagingService.fetchAvailablePackagings(articleId)
        .then(data => {
            setPackagings(data);
        })
        .catch(error => console.error('Error fetching available packaging options:', error));
        // If articleId is not null, fetch article
        if (articleId !== undefined) {
            ArticleService.fetchArticleById(articleId)
            .then(data => {
                setArticle(data);
                CharacteristicService.listInheritedCharacteristics(data.category.id)
                .then(data => {
                    setInheritedCharacteristics(data);
                    // Manually add a value field to characteristics to then send them to the server later
                    const characteristicsAndValue = data.map(characteristic => ({
                        ...characteristic,
                        value: ''
                    }));
                    setCharacteristicAndValue(characteristicsAndValue);
                })
                .catch(error => console.error('Error setting inheritec characteristics:', error));
            })
            .catch(error => console.error('Error fetching article:', error));
        }
    }, [isOpen]);

    function truncateDescription(text) {
        if (text && text.length > 25) {
            return text.substring(0, 25) + '...';
        }
        return text;
    }

    const modifyCharacteristicValue = (characteristicId, value) => {
        setCharacteristicAndValue((prevCharacteristics) => {
            return prevCharacteristics.map(char => 
                char.id === characteristicId ? { ...char, value: value } : char
            );
        });
    }

    const handleCreate = async () => {
        try {
            // Create the product and get the product
            const response = await createFunction(article, packaging);
            
            if (response.success === true) {
                if(images.length > 0){
                    // Create Product API returns the created product as message
                    uploadImageFunction(response.product.id, images);
                }
                characteristicAndValue.forEach((characteristic, index) => {
                    if(characteristic.value !== ''){
                        let product = response.product;
                        let char = inheritedCharacteristics.find(c => c.id === characteristic.id);
                        let value = characteristic.value;
                        assignCharacteristicValueFunction(product, char, value);
                    }
                });
            }
            handleClose();
        } catch (error) {
            // Handle errors
            console.error('Error creating product:', error);
        }
    };

    const renderPackagingToggleButton = () => {
        if (selectedPage === 'structure') {
            return (
                <Button 
                    variant="contained" 
                    color="warning" 
                    sx={{ mr: 1 }} 
                    onClick={(e) => togglePackagingComponent()}
                >
                    Toggle packagings table
                </Button>
            );
        }
        return null;
    };    

    const renderImageUploadButton = () => {
        if (selectedPage === 'images') {
            return (
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{ mr: 1 }}
                >
                    Upload file
                    <VisuallyHiddenInput type="file" multiple onChange={(e) => handleFileChange(e)} />
                </Button>
            );
        }
        return null;
    };    

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
                                <PackagingSelector selectedPackaging={packaging} setSelectedPackaging={setPackaging} articleId={articleId}/>
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
                        <Box>
                            {images.length > 0 && (
                                <Box sx={{ width: '100%', mt: 2 }}>
                                    <Box sx={{ display: 'flex', overflowX: 'auto', mt: 2 }}>
                                        {images.map((image, index) => (
                                        <Box key={index} sx={{ position: 'relative' }}>
                                            <img
                                                src={image}
                                                alt={`Uploaded image ${index}`}
                                                style={{
                                                    width: 'auto',
                                                    height: '200px',
                                                    marginRight: '16px',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    zIndex: 1,
                                                    bg: 'red',
                                                    marginRight: '16px'
                                                }}
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                X
                                            </Button>
                                        </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                );
            case 'characteristics':
                return (
                    <Box>
                        <Typography variant="subtitle2" component="div" gutterBottom>
                            Product Characteristics
                        </Typography>
                        <Box sx={{ overflowY: 'auto', maxHeight: 200 }}>
                            {characteristicAndValue.length > 0 ? 
                                characteristicAndValue.map((characteristic, index) => (
                                    <FormControl key={index} sx={{ m: 1, width: '95%' }} variant="outlined">
                                        <InputLabel htmlFor={`outlined-adornment-${index}`}>{characteristic.name}</InputLabel>
                                        <OutlinedInput
                                            id={`outlined-adornment-${index}`}
                                            value={characteristic.value}
                                            endAdornment={<InputAdornment position="end">{characteristic.unitOfMeasure ? characteristic.unitOfMeasure : ''}</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            onChange={(e) => modifyCharacteristicValue(characteristic.id, e.target.value)}
                                        />
                                    </FormControl>
                                )) : <Box>No characteristics are inherited.</Box>
                            }
                        </Box>
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
                    Only the packagings that are not yet assigned to this particular article can be chosen (thus product does not yet exist).
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
                {showPackagingTable && 
                    <Box sx={{ flexGrow: 1 }}>
                            <hr />
                            <Typography variant="subtitle2" component="div" gutterBottom>Available packaging options:</Typography>
                            <PackagingTable defPageSize={5} defDensity='compact' />
                    </Box>
                }
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                    {renderImageUploadButton()}
                    {renderPackagingToggleButton()}
                    <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={handleCreate}>Save</Button>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateProductModal;
