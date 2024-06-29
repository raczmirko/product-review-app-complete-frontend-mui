import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import React from 'react';

function EditToolbar(props) {
    const { deleterecords, rowselectionmodel, showQuickFilter } = props;
    return (
        <GridToolbarContainer>
            <GridToolbar showQuickFilter={showQuickFilter} />
            <Box sx={{ marginLeft: 'auto' }}>
                <Button color="primary" 
                        startIcon={<DeleteIcon />} 
                        onClick={() => deleterecords(rowselectionmodel)}
                >
                    Delete selected
                </Button>
            </Box>
        </GridToolbarContainer>
    );
}

export default EditToolbar;