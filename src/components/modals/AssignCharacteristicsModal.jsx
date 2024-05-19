import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import CategoryService from '../../services/CategoryService';
import CharacteristicService from '../../services/CharacteristicService';
import NotificationService from '../../services/NotificationService';

const AssignCharacteristicsModal = ({ categoryId, closeFunction, isOpen, setIsOpen }) => {
    const [category, setCategory] = useState([]);
    const [inheritedCharacteristics, setInheritedCharacteristics] = useState([]);
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [filteredLeft, setFilteredLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [filter, setFilter] = useState('');
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
    
    const modifyEntity = async (newCategory) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(`http://localhost:8080/category/${newCategory.id}/modify`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(newCategory)
            });

            if (!response.ok) {
                const errorMessage = NotificationService.getCustomNotification(response.status, await response.text());
                throw new Error('Failed to update category.');
            }
        } catch (error) {
            console.error('Error modifying category:', error);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        closeFunction();
    }

    const handleSave = () => {
        const updatedCategory = category;
        updatedCategory.characteristics = right;
        modifyEntity(updatedCategory);
        handleClose();
    }

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setChecked(newChecked);
    };
    
    const handleAllRight = () => {
        setRight(right.concat(filteredLeft));
        setFilteredLeft([]);
    };
    
    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setFilteredLeft(not(filteredLeft, leftChecked));
        setChecked(not(checked, leftChecked));
    };
    
    const handleCheckedLeft = () => {
        setFilteredLeft(filteredLeft.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };
    
    const handleAllLeft = () => {
        setFilteredLeft(filteredLeft.concat(right));
        setRight([]);
    };

    const customList = (items) => (
        <Paper sx={{ minWidth: 300, height: 300, overflow: 'auto' }}>
          <List dense component="div" role="list">
            {items.map((value) => {
              const labelId = `transfer-list-item-${value.id}-label`;
    
              return (
                <ListItemButton
                  key={value.id}
                  role="listitem"
                  onClick={handleToggle(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.name} secondary={`ID: ${value.id}`} />
                </ListItemButton>
              );
            })}
          </List>
        </Paper>
    );

    function not(a, b) {
        return a.filter((value) => b.indexOf(value) === -1);
    }
      
    function intersection(a, b) {
        return a.filter((value) => b.indexOf(value) !== -1);
    }

    const filterLeftList = (filter) => {
        setFilter(filter);
        const regex = new RegExp(filter, 'i'); // 'i' makes the search case-insensitive
        setFilteredLeft(left.filter(item => regex.test(item.name)));
    }

    const resetFilter = () => {
        setFilter('');
        filterLeftList('');
    }

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    useEffect(() => {
        setCategory(undefined);
        setLeft([]);
        setRight([]);
        // Fetch category tree when the component mounts
        if (categoryId != undefined) {
            CategoryService.getCategory(categoryId)
            .then(data => {
                setCategory(data);
                setRight(data.characteristics);
            })
            .catch(error => console.error('Error:', error));
            CharacteristicService.fetchAvailableCharacteristics(categoryId)
            .then(data => {
                setLeft(data);
                setFilteredLeft(data);
            });
            CharacteristicService.listInheritedCharacteristics(categoryId)
            .then(data => {
                setInheritedCharacteristics(data);
            })
        }
    }, []);

    return (
        <>
        {/* Only render the modal when the category is fetched */}
        {category &&
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="assign-characteristics-modal"
                aria-describedby="modal-to-assign-characteristics"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '60%',
                        minWidth: 800,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        outline: '1px solid #81be83',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h5" component="div" gutterBottom>Assign characteristics to '{category.name}'</Typography>
                    <Typography variant="subtitle2" component="div" gutterBottom>Characteristics are inherited from parent categories. It is not possible to assign characteristics that are already inherited, or that are already assigned to one of the subcategories, thus these don't appear in the list.</Typography>
                    <hr/>
                    <Typography variant="h6" component="div" gutterBottom>{category.name}'s inherited characteristics:</Typography>
                    <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {inheritedCharacteristics.length > 0 ? (
                                inheritedCharacteristics.map(characteristic => (
                                    <Card 
                                        key={characteristic.id} 
                                        sx={{ 
                                            minWidth: 100, 
                                            maxWidth: 'calc(100% / 3)', // Adjust the max width to fit within the container
                                            flexGrow: 1, 
                                            backgroundColor: getRandomColor(), 
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            p: 2,
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="subtitle2" component="div">
                                                {`${characteristic.name} (${characteristic.id})`}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : ('No characteristics inherited.')
                        }
                    </Box>
                    <hr/>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>
                            <Typography variant="h6" component="div" gutterBottom>Available characteristics:</Typography>
                            {customList(filteredLeft)}
                        </Grid>
                        <Grid item>
                            <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleAllRight}
                                disabled={filteredLeft.length === 0}
                                aria-label="move all right"
                            >
                                ≫
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedRight}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedLeft}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleAllLeft}
                                disabled={right.length === 0}
                                aria-label="move all left"
                            >
                                ≪
                            </Button>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" component="div" gutterBottom>Assigned characteristics:</Typography>
                            {customList(right)}
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                        <Box>
                            <TextField 
                                id='filterName'
                                label='Filter name'
                                name='name'
                                size='small'
                                value={filter}
                                onChange={(e) => filterLeftList(e.target.value)}
                                sx={{ maxWidth: '300px' }}
                            />
                            <Button variant="contained" color="error" sx={{ ml: 1 }} onClick={(e) => resetFilter()}>Clear</Button>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={handleSave}>Save</Button>
                            <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        }
        </>
    );
}

export default AssignCharacteristicsModal;