import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'countryOfOrigin',
    headerName: 'Nationality',
    width: 150,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 500,
    editable: true,
  },
];

export default function BrandTable({ data, onFilterChange, onSortChange, onPaginationChange }) {
    const handleFilterModelChange = (model) => {
        if (onFilterChange) {
            onFilterChange(model);
        }
    };
    
    const handleSortModelChange = (model) => {
        if (onSortChange) {
            onSortChange(model);
        }
    };

    const handlePaginationModelChange = (model) => {
        if (onPaginationChange) {
            onPaginationChange(model);
        }
    };

    return (
        <Box sx={{ height: '100%', width: '100%', bgcolor:'black' }}>
        <DataGrid
            autoHeight
            autoPageSize
            editMode="row" 
            rows={data}
            columns={columns}
            filterMode="server"
            sortMode="server"
            paginationMode="server"
            onFilterModelChange={handleFilterModelChange}
            onSortModelChange={handleSortModelChange}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 30, 50, 70, 100]}
            checkboxSelection
            disableRowSelectionOnClick
            initialState={{
                ...data.initialState,
                pagination: { paginationModel: { pageSize: 10 } },
            }}
            sx={{ '--DataGrid-overlayHeight': '300px' }}
        />
        </Box>
    );
}