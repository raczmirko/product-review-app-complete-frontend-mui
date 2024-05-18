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
import CreateBrandModal from '../modals/CreateBrandModal';
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
import { apiRequest } from '../../services/CrudService';
import { Typography } from '@mui/material';
import { getModifiedRowDifference } from '../../util/stringUtil';
import EditToolbar from '../../components/EditToolbar';

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

    const [createBrandModalActive, setModalActive] = useState(false);

    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [confirmationDialogTitle, setConfirmationDialogTitle] = useState('Confirm your action!');
    const [confirmationDialogDescription, setConfirmationDialogDescription] = useState('');
    const [confirmationDialogFunction, setConfirmationDialogFunction] = useState(null);
    const [confirmationDialogFunctionParams, setConfirmationDialogFunctionParams] = useState([]);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
      });
    const [filterModel, setFilterModel] = useState({ items: [] });
    const [sortModel, setSortModel] = useState([]); 
    const [rowModesModel, setRowModesModel] = useState({});
    const [rowSelectionModel, setRowSelectionModel] = useState({});

    const [quickFilterValues, setQuickFilterValues] = useState('');
    
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarText, setSnackBarText] = useState('');
    const [snackBarStatus, setSnackBarStatus] = useState('info');

    const [countries, setCountries] = useState([]);

    function showSnackBar (status, text) {
        setSnackBarOpen(true);
        setSnackBarStatus(status);
        setSnackBarText(text);
    }

    useEffect(() => {
        // Fetch countries when the component mounts
        CountryService.fetchCountries()
            .then(data => setCountries(data))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        searchEntities();
    }, [searchValue, searchColumn, pageSize, pageNumber, orderByColumn, orderByDirection, quickFilterValues, filterModel]);

    const toggleShowModal = () => {
        setModalActive(!createBrandModalActive);
    }

    // --- CRUD API calls --- //

    const deleteEntity = async (id) => {
        const endpoint = `http://localhost:8080/brand/${id}/delete`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'POST', requestBody);
    
        if (result.success) {
            showSnackBar('success', 'Record successfully deleted.');
            searchEntities();
        } else {
            showSnackBar('error', result.message);
        }
    };

    const deleteEntities = async (ids) => {
        if (rowSelectionModel === undefined || rowSelectionModel.length === 0) {
            showSnackBar("error", "No records are selected!");
            return;
        }

        const endpoint = `http://localhost:8080/brand/multi-delete/${ids}`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'POST', requestBody);
    
        if (result.success) {
            showSnackBar('success', 'All records have been successfully deleted.');
            searchEntities();
        } else {
            showSnackBar('error', result.message);
        }
    };

    const createEntity = async (name, country, description) => {
        const endpoint = 'http://localhost:8080/brand/create';
        const requestBody = {
            name: name,
            countryOfOrigin: country,
            description: description
        };
    
        const result = await apiRequest(endpoint, 'POST', requestBody);
    
        if (result.success) {
            searchEntities();
            showSnackBar('success', 'Record successfully created.');
        } else {
            showSnackBar('error', result.message);
        }
    };

    const modifyEntity = async (newBrand) => {
        const endpoint = `http://localhost:8080/brand/${newBrand.id}/modify`;
        const requestBody = newBrand;
    
        const result = await apiRequest(endpoint, 'PUT', requestBody);
    
        if (result.success) {
            showSnackBar('success', 'Record successfully updated.');
            searchEntities();
        } else {
            showSnackBar('error', result.message);
        }
    };

    const searchEntities = async () => {
        if (orderByColumn === '' || orderByColumn === undefined) {setOrderByColumn('name')};
        if (orderByDirection === '' || orderByDirection === undefined) {setOrderByDirection('asc')};

        let queryParams = `?pageSize=${pageSize}&pageNumber=${pageNumber}&orderByColumn=${orderByColumn}&orderByDirection=${orderByDirection}`;
        if (searchValue) queryParams += `&searchText=${searchValue}`;
        if (searchColumn) queryParams += `&searchColumn=${searchColumn}`;
        if (quickFilterValues) queryParams += `&quickFilterValues=${quickFilterValues}`;

        const endpoint = `http://localhost:8080/brand/search${queryParams}`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);
    
        if (result.success) {
            setBrands(result.data.content);
            setTotalPages(result.data.totalPages);
            setTotalElements(result.data.totalElements);
        } else {
            showSnackBar('error', result.message);
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
        setConfirmationDialogTitle("Are you sure want to delete?");
        setConfirmationDialogDescription("This cannot be reverted.");
        setConfirmationDialogFunction(() => deleteEntity);
        setConfirmationDialogFunctionParams([id]);
        setConfirmationDialogOpen(true);
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
            maxWidth="md"
            open={!!updatePromiseArguments}
            >
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent dividers>
                <Typography variant="h6" component="div">Pressing 'Yes' will change:</Typography>
                <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
                    {mutation}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelModification}>No</Button>
                <Button onClick={handleConfirmModification}>Yes</Button>
            </DialogActions>
            </Dialog>
        );
    };

    function SelectEditInputCell(props) {
        const { id, value, field, options } = props;
        const apiRef = useGridApiContext();
        const [selectedCountry, setSelectedCountry] = useState(value);

        const handleChange = (event) => {
            let newCountryName = event.target.value;
            let newCountry = options.find(option => option.name === newCountryName);
            setSelectedCountry(newCountry);
            apiRef.current.setEditCellValue({ id, field, value: newCountry });
            apiRef.current.stopCellEditMode({ id, field });
        };        
      
        return (
          <Select
            value={selectedCountry.name}
            onChange={handleChange}
            size="small"
            sx={{ height: 1 }}
            native
            autoFocus
          >
            {/* Populate options from the countries data */}
            {options.map(option => (
              <option key={option.countryCode} value={option.name}>
                {option.name}
              </option>
            ))}
          </Select>
        );
      }
      
      const renderSelectEditInputCell = (params) => {
        return <SelectEditInputCell {...params} />;
      };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        {
            field: 'countryOfOrigin',
            headerName: 'Nationality',
            width: 150,
            editable: true,
            renderEditCell: (params) => renderSelectEditInputCell({ ...params, options: countries }),
            valueGetter: (value, row) => {
                return row.countryOfOrigin;
            },
            valueFormatter: (value, row) => row.countryOfOrigin.name
        },
        { field: 'description', headerName: 'Description', flex:1, editable: true },
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
            {createBrandModalActive && <CreateBrandModal
                isOpen={createBrandModalActive}
                setIsOpen={setModalActive}
                entityToAdd="brand"
                closeFunction={toggleShowModal}
                createEntityFunction={createEntity}
            />}
            {renderConfirUpdateDialog()}
            {confirmationDialogOpen && <ConfirmationDialog 
                dialogTitle={confirmationDialogTitle}
                dialogDescription={confirmationDialogDescription}
                isOpen={confirmationDialogOpen}
                setIsOpen={setConfirmationDialogOpen}
                functionToRunOnConfirm={confirmationDialogFunction}
                functionParams={confirmationDialogFunctionParams}
            />}
            <DataGrid
                autoHeight
                editMode="row" 
                rowModesModel={rowModesModel}
                onRowSelectionModelChange={handleRowSelectionModelChange}
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