import React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function DataDisplayTable({ data }) {
    // Extract headers from the keys of the first object
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell key={header} align="right">{header.toUpperCase()}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            {headers.map((header) => (
                                <TableCell key={header} align="right">
                                    {typeof row[header] === 'object' && row[header] !== null
                                        ? row[header].name
                                        : row[header]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

DataDisplayTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DataDisplayTable;
