import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, 
        GridToolbar, 
        GridToolbarContainer,
        GridRowModes,
        GridActionsCellItem,
        GridRowEditStopReasons,
        useGridApiContext } from '@mui/x-data-grid';
import AlertSnackBar from '../AlertSnackBar';
import CreateCountryModal from '../modals/CreateCountryModal';
import ConfirmationDialog from '../ConfirmationDialog';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CountryService from '../../services/CountryService';
import Select from '@mui/material/Select';

function getModifiedRowDifference(newRow, oldRow) {
    if (newRow.name !== oldRow.name) {
        return `Name from '${oldRow.name}' to '${newRow.name}'`;
    }
    if (newRow.countryOfOrigin !== oldRow.countryOfOrigin) {
        return `Country code from '${oldRow.countryOfOrigin.name || 'none'}' to '${newRow.countryOfOrigin.name || 'none'}'`;
    }
    return null;
}

function EditToolbar(props) {
    const { setmodalactive, deleterecords, rowselectionmodel, showQuickFilter } = props;
    return (
        <GridToolbarContainer>
            <GridToolbar showQuickFilter />
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

export default function CountriesTable() {

    const [countries, setCountries] = useState([]);
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [countryCodeToDelete, setCountryCodeToDelete] = useState();

    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10,
      });
    const [filterModel, setFilterModel] = React.useState({ items: [] });
    const [sortModel, setSortModel] = React.useState([]); 
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [rowSelectionModel, setRowSelectionModel] = React.useState({});

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
        searchEntities();
    }, [searchValue, searchColumn, pageSize, pageNumber, orderByColumn, orderByDirection, quickFilterValues, filterModel]);

    const toggleShowModal = () => {
        setModalActive(!modalActive);
    }

    const getNotificationTextByStatusCode = (code) => {
        let text = code + ": An error occurred, please try again later!";
        if(code === 400) {
            text = code + ": A country with this name or country code might already exist.";
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

    // --- CRUD API calls --- //

    const deleteEntity = async (countryCode) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(`http://localhost:8080/country/${countryCode}/delete`, {
                method: 'POST',
                headers,
            });
            const errorMessage = getNotificationTextByStatusCode(response.status);
            if (!response.ok) {
                showSnackBar("error", errorMessage);
                throw new Error(errorMessage);
            }
            showSnackBar("success", "Successful deletion.");
            searchEntities();
            return;
        } catch (error) {
            showSnackBar("error", error);
            return [];
        }
    };

    const deleteEntities = async (ids) => {
        if (rowSelectionModel === undefined || rowSelectionModel.length === 0) {
            showSnackBar("error", "No records are selected!");
            return;
        }

        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(`http://localhost:8080/country/multi-delete/${ids}`, {
                method: 'POST',
                headers,
            });
            const errorMessage = getNotificationTextByStatusCode(response.status);
            if (!response.ok) {
                showSnackBar("error", errorMessage);
                throw new Error(errorMessage);
            }
            showSnackBar("success", "All records have been successfully deleted.");
            searchEntities();
            return;
        } catch (error) {
            showSnackBar("error", error);
            return [];
        }
    };

    const createEntity = async (countryCode, name) => {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            const params = {
                countryCode: countryCode,
                name: name
            };

            try {
                const response = await fetch(`http://localhost:8080/country/create`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(params)
                });
                const errorMessage = getNotificationTextByStatusCode(response.status);
                if (!response.ok) {
                    showSnackBar('error', errorMessage);
                    throw new Error(errorMessage);
                }
                searchEntities();
                showSnackBar('success', 'Record successfully.');
                return;
            } catch (error) {
                console.error(error, 'Country may already exist.');
                return [];
            }
    };

    const modifyEntity = async (newCountry) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(`http://localhost:8080/country/${newCountry.countryCode}/modify`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(newCountry)
            });

            if (!response.ok) {
                showSnackBar('error', getNotificationTextByStatusCode(response.status));
                throw new Error('Failed to update country.');
            }
            else {
                showSnackBar('success', "Modification successful.")
            }
        } catch (error) {
            console.error('Error modifying country:', error);
            return [];
        }
    };

    const searchEntities = async () => {
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
            const response = await fetch(`http://localhost:8080/country/search${queryParams}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorMessage = 'Failed to find countries.';
                showSnackBar('error', getNotificationTextByStatusCode(response.status));
                throw new Error(errorMessage);
            }
            const data = await response.json();
            // Id attribute has to manually be added otherwise the GridTable doesn't function correctly
            setCountries(data.content.map(country => ({...country, id: country.countryCode})));
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements)
            return;
        } catch (error) {
            console.error('Error searching countries:', error);
            return []; // Return an empty array if an error occurs
        }
    };

    //  --- Pagination, filtering and sorting-related methods --- //

    const handleFilterChange = (filterModel) => {
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

    const handleRowSelectionModelChange = (rowSelectionModel) => {
        setRowSelectionModel(rowSelectionModel);
    }

    // --- Edit-related functionality --- //

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            setRowModesModel((prevRowModesModel) => ({
                ...prevRowModesModel,
                [params.id]: { mode: GridRowModes.View },
            }));
        }
    };
    
    // Actions row buttons and their handlers
    const setRowModeToEdit = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
    
    const setRowModeToView = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
    
    const handleDeleteClick = (id) => () => {
        setCountryCodeToDelete(id);
        setDeleteDialogOpen(true);
    };
    
    const handleCancelClick = (id) => () => {
        setRowModesModel({...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };
    
    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const processRowUpdate = React.useCallback(
        (newRow, oldRow) =>
          new Promise((resolve, reject) => {
            const difference = getModifiedRowDifference(newRow, oldRow);
            if (difference) {
              // Save the arguments to resolve or reject the promise later
              setUpdatePromiseArguments({ resolve, reject, newRow, oldRow });
            } else {
              resolve(oldRow); // Nothing was changed, resolve promise with the old row data
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
            const response = await modifyEntity(newRow);
            resolve(newRow);
            setUpdatePromiseArguments(null);
            searchEntities();
        } catch (error) {
            reject(oldRow);
            setUpdatePromiseArguments(null);
        }
    };

    const renderConfirUpdateDialog = () => {
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

    const columns = [
        { field: 'countryCode', headerName: 'Country code', width: 150 },
        { field: 'name', headerName: 'Name', flex:1, editable: true },
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
                    onClick={setRowModeToView(id)}
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
                    onClick={setRowModeToEdit(id)}
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

    return (
        <Box sx={{ height: '100%', width: '100%', bgcolor:'black' }}>
            <AlertSnackBar alertType={snackBarStatus} alertText={snackBarText} isOpen={snackBarOpen} setIsOpen={setSnackBarOpen}/>
            <CreateCountryModal
                isOpen={modalActive}
                setIsOpen={setModalActive}
                entityToAdd="country"
                closeFunction={toggleShowModal}
                createEntityFunction={createEntity}
            />
            {renderConfirUpdateDialog()}
            <ConfirmationDialog 
                dialogTitle={"Delete country?"}
                dialogDescription={"This cannot be undone."}
                isOpen={deleteDialogOpen}
                setIsOpen={setDeleteDialogOpen}
                functionToRunOnConfirm={() => deleteEntity(countryCodeToDelete)}
            />
            <DataGrid
                autoHeight
                editMode="row" 
                rowModesModel={rowModesModel}
                onRowSelectionModelChange={handleRowSelectionModelChange}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                rows={countries}
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
                    toolbar: EditToolbar
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        setmodalactive: setModalActive,
                        deleterecords: deleteEntities,
                        rowselectionmodel: rowSelectionModel
                    },
                }}
                sx={{ '--DataGrid-overlayHeight': '300px' }}
            />
        </Box>
        
    );
}