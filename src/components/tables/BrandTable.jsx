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
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}