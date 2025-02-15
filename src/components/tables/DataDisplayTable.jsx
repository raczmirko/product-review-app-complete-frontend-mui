import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import React, { useState } from "react";

function DataDisplayTable({ data, maxHeight }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  // Extract headers from the keys of the first object
  const headers = data?.length > 0 ? Object.keys(data[0]) : [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the rows to be displayed based on the current page and rows per page
  const displayedRows = data?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate the number of empty rows to avoid layout jumps
  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - data?.length);

  return (
    <TableContainer component={Paper}>
      {data && data.length > 0 ? (
        <Box sx={{ maxHeight: maxHeight, overflow: "auto" }}>
          <Table
            stickyHeader
            aria-label="dynamic table"
            size="small"
            sx={{ minWidth: 650, maxHeight: 300 }}
          >
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header} align="left">
                    {header.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {headers.map((header) => (
                    <TableCell key={header} align="left">
                      {typeof row[header] === "object" && row[header] !== null
                        ? row[header].name
                        : row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={headers.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: maxHeight,
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No data available
          </Typography>
        </Box>
      )}
      {data && data.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </TableContainer>
  );
}

DataDisplayTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  maxHeight: PropTypes.number,
};

export default DataDisplayTable;
