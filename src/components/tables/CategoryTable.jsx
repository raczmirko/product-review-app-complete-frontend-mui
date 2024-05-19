import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddLinkIcon from '@mui/icons-material/AddLink';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes,
    useGridApiContext
} from '@mui/x-data-grid';
import * as React from 'react';
import { useEffect, useState } from 'react';
import EditToolbar from '../../components/EditToolbar';
import CategoryService from '../../services/CategoryService';
import { apiRequest } from '../../services/CrudService';
import { getModifiedRowDifference } from '../../util/stringUtil';
import AlertSnackBar from '../AlertSnackBar';
import ConfirmationDialog from '../ConfirmationDialog';
import AssignCharacteristicsModal from '../modals/AssignCharacteristicsModal';
import CategoryTreeModal from '../modals/CategoryTreeModal';
import CreateCategoryModal from '../modals/CreateCategoryModal';

export default function CategoryTable() {

    const [categories, setCategories] = useState([]);
    const [availableParentCaregories, setAvailableParentCategories] = useState([]);
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

    const [creationModalActive, setCreationModalActive] = useState(false);
    const [treeModalActive, setTreeModalActive] = useState(false);
    const [assignCharacteristicsModalActive, setAssignCharacteristicsModalActive] = useState(false);
    
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [confirmationDialogTitle, setConfirmationDialogTitle] = useState('Confirm your action!');
    const [confirmationDialogDescription, setConfirmationDialogDescription] = useState('');
    const [confirmationDialogFunction, setConfirmationDialogFunction] = useState(null);
    const [confirmationDialogFunctionParams, setConfirmationDialogFunctionParams] = useState([]);

    const [idOfActionRow, setIdOfActionRow] = useState();

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

    function showSnackBar (status, text) {
        setSnackBarOpen(true);
        setSnackBarStatus(status);
        setSnackBarText(text);
    }

    useEffect(() => {
        // Fetch categories when the component mounts
        CategoryService.fetchAvailableParentCategories()
            .then(data => setAvailableParentCategories(data))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        searchEntities();
    }, [searchValue, searchColumn, pageSize, pageNumber, orderByColumn, orderByDirection, quickFilterValues, filterModel]);

    // --- Modal-related functions --- //

    const toggleShowCreationModal = () => {
        setCreationModalActive(!creationModalActive);
    }

    const toggleShowTreeModal = () => {
        setTreeModalActive(!treeModalActive);
    }

    const toggleShowAssignemntModal = () => {
        setAssignCharacteristicsModalActive(!assignCharacteristicsModalActive);
    }

    const handleShowTreeModalClick = (id) => () => {
        setIdOfActionRow(id);
        setTreeModalActive(true);
    };

    const handleShowAssignmentModalClick = (id) => () => {
        setIdOfActionRow(id);
        toggleShowAssignemntModal();
    };

    // --- CRUD API calls --- //

    const deleteEntity = async (id) => {
        const endpoint = `http://localhost:8080/category/${id}/delete`;
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

        const endpoint = `http://localhost:8080/category/multi-delete/${ids}`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'POST', requestBody);
    
        if (result.success) {
            showSnackBar('success', 'All records have been successfully deleted.');
            searchEntities();
        } else {
            showSnackBar('error', result.message);
        }
    };

    const createEntity = async (name, parentCategory, description) => {
        const endpoint = 'http://localhost:8080/category/create';
        const requestBody = {
            name: name,
            parentCategory: parentCategory ? parentCategory : undefined,
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

    const modifyEntity = async (newCategory) => {
        const endpoint = `http://localhost:8080/category/${newCategory.id}/modify`;
        const requestBody = newCategory;
    
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

        const endpoint = `http://localhost:8080/category/search${queryParams}`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);
    
        if (result.success) {
            setCategories(result.data.content);
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
            maxWidth="xs"
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
        const [selectedCategory, setSelectedCategory] = useState(value);

        const handleChange = (event) => {
            let newCategoryName = event.target.value;
            let newCategory;
            if(newCategoryName === 'none') {
                newCategory = undefined;
                setSelectedCategory(undefined);
            }
            else {
                newCategory = options.find(option => option.name === newCategoryName);
                setSelectedCategory(newCategory);
            }
            apiRef.current.setEditCellValue({ id, field, value: newCategory });
            apiRef.current.stopCellEditMode({ id, field });
        };        
      
        return (
          <Select
            value={selectedCategory ? selectedCategory.name : 'none'}
            onChange={handleChange}
            size="small"
            sx={{ height: 1 }}
            native
            autoFocus
          >
            {/* Populate options from the categories data */}
            <option value='none'>None</option>
            {options.map(option => (
                id != option.id && (
                    <option key={option.id} value={option.name}>
                        {option.name}
                    </option>
                )
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
            field: 'parentCategory',
            headerName: 'Parent category',
            width: 150,
            editable: true,
            renderEditCell: (params) => renderSelectEditInputCell({ ...params, options: availableParentCaregories }),
            valueGetter: (value, row) => {
                return row.parentCategory;
            },
            valueFormatter: (value, row) => row.parentCategory ? row.parentCategory.name : undefined
        },
        { field: 'description', headerName: 'Description', flex:1, editable: true },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 180,
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
                    icon={<AccountTreeIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleShowTreeModalClick(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<AddLinkIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleShowAssignmentModalClick(id)}
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

    const handleProcessRowUpdateError = (error) => {
        console.error('Error updating row:', error);
        showSnackBar('error', error.message)
    };

    return (
        <Box sx={{ height: '100%', width: '100%', bgcolor:'black' }}>
            <AlertSnackBar alertType={snackBarStatus} alertText={snackBarText} isOpen={snackBarOpen} setIsOpen={setSnackBarOpen}/>
            {creationModalActive && <CreateCategoryModal
                isOpen={creationModalActive}
                setIsOpen={setCreationModalActive}
                entityToAdd="category"
                closeFunction={toggleShowCreationModal}
                createEntityFunction={createEntity}
            />}
            {treeModalActive && <CategoryTreeModal
                isOpen={treeModalActive}
                setIsOpen={setTreeModalActive}
                closeFunction={toggleShowTreeModal}
                categoryTreeId={idOfActionRow}
            />}
            {assignCharacteristicsModalActive && <AssignCharacteristicsModal
                isOpen={assignCharacteristicsModalActive}
                setIsOpen={setAssignCharacteristicsModalActive}
                closeFunction={toggleShowAssignemntModal}
                categoryId={idOfActionRow}
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
                onProcessRowUpdateError={handleProcessRowUpdateError}
                rows={categories}
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
                        setmodalactive: setCreationModalActive,
                        deleterecords: deleteEntities,
                        rowselectionmodel: rowSelectionModel
                    },
                }}
                sx={{ '--DataGrid-overlayHeight': '300px' }}
            />
        </Box>
        
    );
}