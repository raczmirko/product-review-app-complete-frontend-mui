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
import BrandService from '../../services/BrandService'
import Select from '@mui/material/Select';
import NotificationService from "../../services/NotificationService";
import CategoryService from '../../services/CategoryService';

function getModifiedRowDifference(newRow, oldRow) {
    if (newRow.name !== oldRow.name) {
        return `Name from '${oldRow.name}' to '${newRow.name}'`;
    }
    if (newRow.description !== oldRow.description) {
        return `Description from '${oldRow.description || 'none'}' to '${newRow.description || 'none'}'`;
    }
    if (newRow.brand !== oldRow.brand) {
        return `Brand from '${oldRow.brand.name || 'none'}' to '${newRow.brand.name || 'none'}'`;
    }
    if (newRow.category !== oldRow.category) {
        return `Category from '${oldRow.category.name || 'none'}' to '${newRow.category.name || 'none'}'`;
    }
    return null;
}

function EditToolbar(props) {
    const { setmodalactive, deleterecords, rowselectionmodel, showQuickFilter } = props;
    return (
        <GridToolbarContainer>
            <GridToolbar showQuickFilter/>
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

export default function BrandTable() {

    const [articles, setArticles] = useState([]);
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

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    function showSnackBar (status, text) {
        setSnackBarOpen(true);
        setSnackBarStatus(status);
        setSnackBarText(text);
    }

    useEffect(() => {
        // Fetch categories and brands when the component mounts
        CategoryService.fetchCategories()
            .then(data => setCategories(data))
            .catch(error => console.error('Error:', error));
        BrandService.fetchBrands()
            .then(data => setBrands(data))
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
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(`http://localhost:8080/article/${id}/delete`, {
                method: 'POST',
                headers,
            });
            if (!response.ok) {
                const errorMessage = NotificationService.getCustomNotification(response.status, await response.text());
                showSnackBar('error', errorMessage);
                throw new Error(errorMessage);
            }
            else {
                showSnackBar("success", "Successful deletion.");
            }
            searchEntities();
        } catch (error) {
            console.error(error);
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
            const response = await fetch(`http://localhost:8080/article/multi-delete/${ids}`, {
                method: 'POST',
                headers,
            });
            if (!response.ok) {
                const errorMessage = NotificationService.getCustomNotification(response.status, await response.text());
                showSnackBar('error', errorMessage);
                throw new Error(errorMessage);
            }
            else {
                showSnackBar("success", "All records have been successfully deleted.");
            }
            searchEntities();
        } catch (error) {
            console.error(error);
        }
    };

    const createEntity = async (name, country, description) => {
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
                const response = await fetch(`http://localhost:8080/article/create`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(params)
                });
                if (!response.ok) {
                    const errorMessage = NotificationService.getCustomNotification(response.status, await response.text());
                    showSnackBar('error', errorMessage);
                    throw new Error(errorMessage);
                }
                else {
                    showSnackBar('success', 'Record successfully created.');
                }
                searchEntities();
            } catch (error) {
                console.error(error);
            }
    };

    const modifyEntity = async (newArticle) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(`http://localhost:8080/article/${newArticle.id}/modify`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(newArticle)
            });

            if (!response.ok) {
                const errorMessage = NotificationService.getCustomNotification(response.status, await response.text());
                showSnackBar('error', errorMessage);
                throw new Error(errorMessage);
            }
            else {
                showSnackBar('success', "Modification successful.")
            }
        } catch (error) {
            console.error('Error modifying brand:', error);
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
            const response = await fetch(`http://localhost:8080/article/search${queryParams}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorMessage = NotificationService.getCustomNotification(response.status, await response.text());
                showSnackBar('error', errorMessage);
                throw new Error(errorMessage);
            }
            const data = await response.json();
            setArticles(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements)
            return;
        } catch (error) {
            console.error('Error searching articles:', error);
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
                {`Pressing 'Yes' will change ${mutation}.`}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelModification}>No</Button>
                <Button onClick={handleConfirmModification}>Yes</Button>
            </DialogActions>
            </Dialog>
        );
    };

    function SelectCategoryEditInputCell(props) {
        const { id, value, field, options } = props;
        const apiRef = useGridApiContext();
        const [selectedCategory, setSelectedCategory] = useState(value);

        const handleChange = (event) => {
            let newCategoryName = event.target.value;
            let newCategory;
            newCategory = options.find(option => option.name === newCategoryName);
            setSelectedCategory(newCategory);
            apiRef.current.setEditCellValue({ id, field, value: newCategory });
            apiRef.current.stopCellEditMode({ id, field });
        };        
      
        return (
          <Select
            value={selectedCategory.name}
            onChange={handleChange}
            size="small"
            sx={{ height: 1 }}
            native
            autoFocus
          >
            {/* Populate options from the categories data */}
            {options.map(option => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </Select>
        );
    }
      
    const renderSelectCategoryEditInputCell = (params) => {
        return <SelectCategoryEditInputCell {...params} />;
    };

    function SelectBrandEditInputCell(props) {
        const { id, value, field, options } = props;
        const apiRef = useGridApiContext();
        const [selectedBrand, setSelectedBrand] = useState(value);

        const handleChange = (event) => {
            let newBrandName = event.target.value;
            let newBrand = options.find(option => option.name === newBrandName);
            setSelectedBrand(newBrand);
            apiRef.current.setEditCellValue({ id, field, value: newBrand });
            apiRef.current.stopCellEditMode({ id, field });
        };        
      
        return (
          <Select
            value={selectedBrand.name}
            onChange={handleChange}
            size="small"
            sx={{ height: 1 }}
            native
            autoFocus
          >
            {/* Populate options from the countries data */}
            {options.map(option => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </Select>
        );
    }
      
    const renderSelectBrandEditInputCell = (params) => {
        return <SelectBrandEditInputCell {...params} />;
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            editable: true,
            renderEditCell: (params) => renderSelectCategoryEditInputCell({ ...params, options: categories }),
            valueGetter: (value, row) => {
                return row.category;
            },
            valueFormatter: (value, row) => row.category.name
        },
        {
            field: 'brand',
            headerName: 'Brand',
            width: 150,
            editable: true,
            renderEditCell: (params) => renderSelectBrandEditInputCell({ ...params, options: brands }),
            valueGetter: (value, row) => {
                return row.brand;
            },
            valueFormatter: (value, row) => row.brand.name
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
                rows={articles}
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