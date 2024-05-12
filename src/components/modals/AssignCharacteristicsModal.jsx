import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CategoryService from '../../services/CategoryService';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import CharacteristicService from '../../services/CharacteristicService';
import NotificationService from '../../services/NotificationService';

const AssignCharacteristicsModal = ({ categoryId, closeFunction, isOpen, setIsOpen }) => {
    const [category, setCategory] = useState([]);
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);
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
        setRight(right.concat(left));
        setLeft([]);
    };
    
    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };
    
    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };
    
    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const customList = (items) => (
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
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
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        outline: '1px solid #81be83',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h5" component="div" gutterBottom>Assign characteristics to {category.name}</Typography>
                    <hr/>
                    <Typography variant="p" component="div" gutterBottom>Characteristics are inherited from parent categories.</Typography>
                    <hr/>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>{customList(left)}</Grid>
                        <Grid item>
                            <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleAllRight}
                                disabled={left.length === 0}
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
                        <Grid item>{customList(right)}</Grid>
                    </Grid>
                    <Box sx={{ textAlign: 'right'}}>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={handleSave}>Save</Button>
                        <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        }
        </>
    );
}

export default AssignCharacteristicsModal;