import React from 'react';
import { GridToolbarContainer, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function EditToolbar(props) {
    const { setmodalactive, deleterecords, rowselectionmodel, showQuickFilter } = props;
    return (
        <GridToolbarContainer>
            <GridToolbar showQuickFilter={showQuickFilter} />
            <Button color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={() => setmodalactive(true)}
            >
                Add record
            </Button>
            <Button color="primary" 
                    startIcon={<DeleteIcon />} 
                    onClick={() => deleterecords(rowselectionmodel)}
            >
                Delete selected
            </Button>
        </GridToolbarContainer>
    );
}

export default EditToolbar;