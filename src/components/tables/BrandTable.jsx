import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, 
        GridToolbar, 
        GridToolbarContainer,
        GridRowModes,
        GridActionsCellItem,
        GridRowEditStopReasons } from '@mui/x-data-grid';
import AlertSnackBar from '../AlertSnackBar';
import CreateBrandModal from '../modals/CreateBrandModal';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

function getModifiedRowDifference(newRow, oldRow) {
    if (newRow.name !== oldRow.name) {
        return `Name from '${oldRow.name}' to '${newRow.name}'`;
    }
    if (newRow.countryOfOrigin !== oldRow.countryOfOrigin) {
        return `Country from '${oldRow.countryOfOrigin.name || ''}' to '${newRow.countryOfOrigin.name || ''}'`;
    }
    if (newRow.description !== oldRow.description) {
        return `Description from '${oldRow.description || ''}' to '${newRow.description || ''}'`;
    }
    return null;
}

export default function BrandTable() {

    const [brands, setBrands] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState('');
    const [totalElements, setTotalElements] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [searchColumn, setSearchColumn] = useState('');
    const [searchOperator, setSearchOperator] = useState('');
    const [orderByColumn, setOrderByColumn] = useState('name');
    const [orderByDirection, setOrderByDirection] = useState('asc');

    const [updatePromiseArguments, setUpdatePromiseArguments] = useState(null);

    const [modalActive, setModalActive] = useState(false);

    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10,
      });
    const [filterModel, setFilterModel] = React.useState({ items: [] });
    const [sortModel, setSortModel] = React.useState([]); 
    const [rowModesModel, setRowModesModel] = React.useState({});

    const [quickFilterValues, setQuickFilterValues] = useState('');
    
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarText, setSnackBarText] = useState('');
    const [snackBarStatus, setSnackBarStatus] = useState('info');

    function showSnackBar (status, text) {
        setSnackBarOpen(true);
        setSnackBarStatus(status);
        setSnackBarText(text);
    }

    useEffect(() => {
        searchBrands();
    }, [searchValue, searchColumn, pageSize, pageNumber, orderByColumn, orderByDirection, quickFilterValues, filterModel]);

    const toggleShowModal = () => {
        setModalActive(!modalActive);
    }

    const getNotificationTextByStatusCode = (code) => {
        let text = code + ": An error occurred, please try again later!";
        if(code === 400) {
            text = code + ": Bad request.";
        }
        if(code === 401) {
            text = code + ": Authentication failed. Log in again!";
        }
        if(code === 403) {
            text = code + ": You cannot access this page. Your session might have expired or you might need admin privileges to view.";
        }
        if(code === 404) {
            text = code + ": NOT FOUND.";
        }
        return text;
    }

    const deleteBrand = async (id) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(`http://localhost:8080/brand/${id}/delete`, {
                method: 'POST',
                headers,
            });
            const errorMessage = getNotificationTextByStatusCode(response.status);
            if (!response.ok) {
                //setNotification({ type: "error", title:"error", text: "Failed to delete brand with an error code " + errorMessage});
                throw new Error(errorMessage);
            }
            searchBrands();
            //setNotification({ type: "success", title:"success", text: "Brand successfully deleted."});
            return;
        } catch (error) {
            //setNotification({ type: "error", title:"error", text: error});
            return []; // Return an empty array if an error occurs
        }
    };

    const createBrand = async (name, country, description) => {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            const params = {
                name: name,
                countryOfOrigin: country,
                description: description
            };

            try {
                const response = await fetch(`http://localhost:8080/brand/create`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(params)
                });
                const errorMessage = getNotificationTextByStatusCode(response.status);
                if (!response.ok) {
                    //setNotification({ type: "error", title:"error", text: "Failed to create brand with an error code " + errorMessage});
                    throw new Error(errorMessage);
                }
                searchBrands();
                //setNotification({ type: "success", title:"success", text: "Brand successfully created."});
                return;
            } catch (error) {
                //setNotification({ type: "error", title:"error", text: error});
                return []; // Return an empty array if an error occurs
            }
    };

    const modifyBrand = async (newBrand) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Setting the countryOfOrigin property to undefined otherwise the DTO mapping will fail
        newBrand.countryOfOrigin = undefined;

        try {
            const response = await fetch(`http://localhost:8080/brand/${newBrand.id}/modify`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(newBrand)
            });

            if (!response.ok) {
                const errorMessage = 'Failed to update brand.';
                showSnackBar('error', getNotificationTextByStatusCode(response.status));
                throw new Error(errorMessage);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting brand:', error);
            return []; // Return an empty array if an error occurs
        }
    };

    const searchBrands = async () => {
        if (orderByColumn === '' || orderByColumn === undefined) {setOrderByColumn('name')};
        if (orderByDirection === '' || orderByDirection === undefined) {setOrderByDirection('asc')};

        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        let queryParams = `?pageSize=${pageSize}&pageNumber=${pageNumber}&orderByColumn=${orderByColumn}&orderByDirection=${orderByDirection}`;
        if (searchValue) queryParams += `&searchText=${searchValue}`;
        if (searchColumn) queryParams += `&searchColumn=${searchColumn}`;
        if (quickFilterValues) queryParams += `&quickFilterValues=${quickFilterValues}`;

        try {
            const response = await fetch(`http://localhost:8080/brand/search${queryParams}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorMessage = 'Failed to find brands.';
                showSnackBar('error', getNotificationTextByStatusCode(response.status));
                throw new Error(errorMessage);
            }
            const data = await response.json();
            setBrands(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements)
            return;
        } catch (error) {
            console.error('Error deleting brand:', error);
            return []; // Return an empty array if an error occurs
        }
    };

    const handleFilterChange = (filterModel) => {
        console.log(filterModel)
        setFilterModel(filterModel);
        if(filterModel.items[0]?.value) {
            setSearchValue(filterModel.items[0].value);
        } 
        else {
            // If filterModel's value doesn't exist (thus not filtering) set the filter to an empty string
            // To trigger the table refresh mechanism and display all records
            setSearchValue('');
        }
        if(filterModel.items[0]?.field){
            setSearchColumn(filterModel.items[0].field);
        }
        else {
            setSearchColumn('');
        }
        if(filterModel.items[0]?.operator){setSearchOperator(filterModel.items[0].operator);}
        if(filterModel.quickFilterValues){setQuickFilterValues(filterModel.quickFilterValues);}
    };

    const handleSortChange = (sortModel) => {
        if(sortModel[0]){
            setOrderByColumn(sortModel[0].field);
            setOrderByDirection(sortModel[0].sort);
        }
        else {
            // Setting the order to default when sorting is removed
            setOrderByColumn('name');
            setOrderByDirection('asc');
        }    
        setSortModel(sortModel);  
    };

    const handlePaginationChange = (paginationModel) => {
        setPaginationModel(paginationModel);
        setPageSize(paginationModel.pageSize);
        setPageNumber(paginationModel.page + 1);
    };

    // Edit-related functionality

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };
    
    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
    
    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
    
    const handleDeleteClick = (id) => () => {
        deleteBrand(id);
        searchBrands();
    };
    
    const handleCancelClick = (id) => () => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = brands.find((row) => row.id === id);
        if (editedRow.isNew) {
          setBrands(brands.filter((brand) => brand.id !== id));
        }
    };
    
    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        {
            field: 'countryOfOriginName', // Change the field name
            headerName: 'Nationality',
            width: 150,
            editable: true,
            valueGetter: (value, row) => {
                return row.countryOfOrigin.name;
              }
        },
        { field: 'description', headerName: 'Description', width: 500, editable: true },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        
                if (isInEditMode) {
                return [
                    <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    sx={{
                        color: 'primary.main',
                    }}
                    onClick={handleSaveClick(id)}
                    />,
                    <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit"
                    />,
                ];
                }
        
                return [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                />,
                ];
            }
    }];

    const processRowUpdate = React.useCallback(
        (newRow, oldRow) =>
          new Promise((resolve, reject) => {
            const difference = getModifiedRowDifference(newRow, oldRow);
            if (difference) {
              // Save the arguments to resolve or reject the promise later
              setUpdatePromiseArguments({ resolve, reject, newRow, oldRow });
            } else {
              resolve(oldRow); // Nothing was changed
            }
          }),
        [],
    );

    const handleCancelModification = () => {
        const { oldRow, resolve } = updatePromiseArguments;
        resolve(oldRow); // Resolve with the old row to not update the internal state
        setUpdatePromiseArguments(null);
      };
    
    const handleConfirmModification = async () => {
        const { newRow, oldRow, reject, resolve } = updatePromiseArguments;

        try {
            // Make the HTTP request to save in the backend
            const response = await modifyBrand(newRow);
            showSnackBar('success', 'User successfully saved');
            resolve(response);
            setUpdatePromiseArguments(null);
        } catch (error) {
        showSnackBar('error', 'Failed to save user.');
            reject(oldRow);
            setUpdatePromiseArguments(null);
        }
    };

    const renderConfirmDialog = () => {
        if (!updatePromiseArguments) {
            return null;
        }

        const { newRow, oldRow } = updatePromiseArguments;
        const mutation = getModifiedRowDifference(newRow, oldRow);

        return (
            <Dialog
            maxWidth="xs"
            open={!!updatePromiseArguments}
            >
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent dividers>
                {`Pressing 'Yes' will change ${mutation}.`}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelModification}>No</Button>
                <Button onClick={handleConfirmModification}>Yes</Button>
            </DialogActions>
            </Dialog>
        );
    };

    return (
        <Box sx={{ height: '100%', width: '100%', bgcolor:'black' }}>
            <AlertSnackBar alertType={snackBarStatus} alertText={snackBarText} isOpen={snackBarOpen} setIsOpen={setSnackBarOpen}/>
            {modalActive &&
                
                    <CreateBrandModal
                        entityToAdd="brand"
                        closeFunction={toggleShowModal}
                        createBrandFunction={createBrand}
                     />

            }
            {renderConfirmDialog()}
            <DataGrid
                autoHeight
                editMode="row" 
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                rows={brands}
                rowCount={totalElements}
                columns={columns}
                filterMode="server"
                sortingMode="server"
                paginationMode="server"
                onFilterModelChange={handleFilterChange}
                onSortModelChange={handleSortChange}
                onPaginationModelChange={handlePaginationChange}
                pageSizeOptions={[10, 30, 50, 70, 100]}
                initialState={{
                    pagination: {
                    paginationModel: paginationModel,
                    },
                    filter: {
                        filterModel: filterModel,
                    },
                    sorting: {
                        sortModel: sortModel
                    }
                }}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{
                    toolbar: (props) => (
                        <React.Fragment>
                            <GridToolbarContainer>
                                <GridToolbar {...props} />
                                <Box>
                                    <ButtonGroup sx={{width:'100%'}}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ color: 'white' }}
                                            onClick={() => {
                                                setModalActive(true);
                                            }}
                                        >
                                            Create brand
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                
                                            }}
                                        >
                                            Delete selected
                                        </Button>
                                    </ButtonGroup>
                                </Box>
                            </GridToolbarContainer>
                        </React.Fragment>
                    )
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true
                    },
                }}
                sx={{ '--DataGrid-overlayHeight': '300px' }}
            />
        </Box>
        
    );
}