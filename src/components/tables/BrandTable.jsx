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

export default function BrandTable({ data }) {

    return (
        <Box sx={{ height: '100%', width: '100%', bgcolor:'black' }}>
        <DataGrid
            rows={data}
            columns={columns}
            getRowHeight={() => 'auto'}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 10,
                },
            },
            }}
            pageSizeOptions={[10, 30, 50, 70, 100]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
                [`& .${gridClasses.cell}`]: {
                py: 1,
                },
            }}    
        />
        </Box>
    );
}