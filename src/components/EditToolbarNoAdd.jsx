import React from 'react';
import { GridToolbarContainer, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';

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