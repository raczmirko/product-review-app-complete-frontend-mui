import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import QuizIcon from '@mui/icons-material/Quiz';
import SaveIcon from '@mui/icons-material/Save';
import CharacteristicsIcon from '@mui/icons-material/Style';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes, useGridApiContext } from '@mui/x-data-grid';
import * as React from 'react';
import { useEffect, useState } from 'react';
import EditToolbar from '../../components/EditToolbar';
import BrandService from '../../services/BrandService';
import CategoryService from '../../services/CategoryService';
import { apiRequest } from '../../services/CrudService';
import { useNotification } from '../../services/NotificationProvider';
import { getModifiedRowDifference } from '../../util/stringUtil';
import ConfirmationDialog from '../ConfirmationDialog';
import CreateArticleModal from '../modals/CreateArticleModal';
import CreateProductModal from '../modals/CreateProductModal';
import ListAspectsModal from '../modals/ListAspectsModal';
import ListCharacteristicsModal from '../modals/ListCharacteristicsModal';

export default function ArticleTable() {

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

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
    const [loading, setLoading] = useState(false);

    const [updatePromiseArguments, setUpdatePromiseArguments] = useState(null);

    const [creationModalActive, setCreationModalActive] = useState(false);
    const [createProductModalActive, setCreateProductModalActive] = useState(false);
    const [characteristicsModalActive, setCharacteristicsModalActive] = useState(false);
    const [aspectsModalActive, setAspectsModalActive] = useState(false);

    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [confirmationDialogTitle, setConfirmationDialogTitle] = useState('Confirm your action!');
    const [confirmationDialogDescription, setConfirmationDialogDescription] = useState('');
    const [confirmationDialogFunction, setConfirmationDialogFunction] = useState(null);
    const [confirmationDialogFunctionParams, setConfirmationDialogFunctionParams] = useState([]);

    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10});
    const [filterModel, setFilterModel] = useState({ items: [] });
    const [sortModel, setSortModel] = useState([]); 
    const [rowModesModel, setRowModesModel] = useState({});
    const [rowSelectionModel, setRowSelectionModel] = useState({});

    const [quickFilterValues, setQuickFilterValues] = useState('');
    
    const [leafCategories, setLeafCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [idOfActionRow, setIdOfActionRow] = useState('');
    const [idOfActionRowCategory, setIdOfActionRowCategory] = useState(undefined);

    const showNotification = useNotification();

    useEffect(() => {
        // Fetch categories and brands when the component mounts
        CategoryService.fetchLeafCategories()
            .then(data => setLeafCategories(data))
            .catch(error => console.error('Error:', error));
        BrandService.fetchBrands()
            .then(data => setBrands(data))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        searchEntities();
    }, [searchValue, searchColumn, pageSize, pageNumber, orderByColumn, orderByDirection, quickFilterValues, filterModel]);

    // --- Modal-related functions --- //

    const toggleShowCreationModal = () => {
        setCreationModalActive(!creationModalActive);
    }

    const toggleShowCreateProductModal = (id) => () => {
        setIdOfActionRow(id);
        setCreateProductModalActive(!createProductModalActive);
    }

    const toggleShowCharacteristicsModal = (id) => () => {
        setIdOfActionRow(id);
        setCharacteristicsModalActive(!characteristicsModalActive);
    }

    const toggleShowAspectsModal = (id) => () => {
        setIdOfActionRow(id);
        let categoryId = articles.find((article) => article.id === id).category.id;
        setIdOfActionRowCategory(categoryId);
        setAspectsModalActive(!aspectsModalActive);
    }

    // --- CRUD API calls --- //

    const deleteEntity = async (id) => {
        const endpoint = `${API_BASE_URL}/article/${id}/delete`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'POST', requestBody);
    
        if (result.success) {
            showNotification('success', 'SUCCESS: Article deleted.');
            searchEntities();
        } else {
            showNotification('error', result.message);
        }
    };

    const deleteEntities = async (ids) => {
        if (rowSelectionModel === undefined || rowSelectionModel.length === 0) {
            showNotification("error", "No records are selected!");
            return;
        }

        const endpoint = `${API_BASE_URL}/article/multi-delete/${ids}`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'POST', requestBody);
    
        if (result.success) {
            showNotification('success', 'All records have been successfully deleted.');
            searchEntities();
        } else {
            showNotification('error', result.message);
        }
    };

    const createArticle = async (name, category, brand, description) => {
        const endpoint = `${API_BASE_URL}/article/create`;
        const requestBody = {
            name: name,
            category: category,
            brand: brand,
            description: description
        };
    
        const result = await apiRequest(endpoint, 'POST', requestBody);
    
        if (result.success) {
            searchEntities();
            showNotification('success', 'SUCCESS: Article created.');
        } else {
            showNotification('error', result.message);
        }
    };

    const modifyEntity = async (newArticle) => {
        const endpoint = `${API_BASE_URL}/article/${newArticle.id}/modify`;
        const requestBody = newArticle;
    
        const result = await apiRequest(endpoint, 'PUT', requestBody);
    
        if (result.success) {
            showNotification('success', 'SUCCESS: Article updated.');
            searchEntities();
        } else {
            showNotification('error', result.message);
        }
    };

    const searchEntities = async () => {
        if (orderByColumn === '' || orderByColumn === undefined) {setOrderByColumn('name')};
        if (orderByDirection === '' || orderByDirection === undefined) {setOrderByDirection('asc')};

        setLoading(true);

        let queryParams = `?pageSize=${pageSize}&pageNumber=${pageNumber}&orderByColumn=${orderByColumn}&orderByDirection=${orderByDirection}`;
        if (searchValue) queryParams += `&searchText=${searchValue}`;
        if (searchColumn) queryParams += `&searchColumn=${searchColumn}`;
        if (quickFilterValues) queryParams += `&quickFilterValues=${quickFilterValues}`;

        const endpoint = `${API_BASE_URL}/article/search${queryParams}`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);
    
        if (result.success) {
            setArticles(result.data.content);
            setTotalPages(result.data.totalPages);
            setTotalElements(result.data.totalElements);
            setLoading(false);
        } else {
            showNotification('error', result.message);
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
        { field: 'id', headerName: 'ID', width: 60 },
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            editable: true,
            renderEditCell: (params) => renderSelectCategoryEditInputCell({ ...params, options: leafCategories }),
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
            width: 200,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                return [
                    <Tooltip title={'Save row'}>
                        <GridActionsCellItem
                        icon={<SaveIcon />}
                        label="Save"
                        onClick={setRowModeToView(id)}
                        />
                    </Tooltip>,
                    <Tooltip title={'Cancel modifications'}>
                        <GridActionsCellItem
                        icon={<CancelIcon />}
                        label="Cancel"
                        className="textPrimary"
                        onClick={handleCancelClick(id)}
                        />
                    </Tooltip>,
                ];
                }
        
                return [
                <Tooltip title={'Edit row'}>
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={setRowModeToEdit(id)}
                    />
                </Tooltip>,
                <Tooltip title={'Create product from article'}>
                    <GridActionsCellItem
                        icon={<AddCircleOutlineIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={toggleShowCreateProductModal(id)}
                    />
                </Tooltip>,
                <Tooltip title={'Show assigned characteristics'}>
                    <GridActionsCellItem
                        icon={<CharacteristicsIcon />}
                        label="Show characteristics"
                        className="textPrimary"
                        onClick={toggleShowCharacteristicsModal(id)}
                    />
                </Tooltip>,
                <Tooltip title={'Show review aspects'}>
                <GridActionsCellItem
                    icon={<QuizIcon />}
                    label="Show review aspects"
                    className="textPrimary"
                    onClick={toggleShowAspectsModal(id)}
                />
            </Tooltip>,
                <Tooltip title={'Delete row'}>
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                    />
                </Tooltip>,
                ];
            }
    }];

    return (
        <Box sx={{ height: '100%', width: '100%', bgcolor:'black' }}>
            {creationModalActive && <CreateArticleModal
                isOpen={creationModalActive}
                setIsOpen={setCreationModalActive}
                entityToAdd="brand"
                closeFunction={toggleShowCreationModal}
                createEntityFunction={createArticle}
            />}
            {createProductModalActive && <CreateProductModal
                isOpen={createProductModalActive}
                setIsOpen={setCreateProductModalActive}
                articleId={idOfActionRow}
                closeFunction={toggleShowCreateProductModal}
                showNotification={showNotification}
            />}
            {characteristicsModalActive && <ListCharacteristicsModal
                isOpen={characteristicsModalActive}
                setIsOpen={setCharacteristicsModalActive}
                articleId={idOfActionRow}
                closeFunction={toggleShowCharacteristicsModal}
            />}
            {aspectsModalActive && <ListAspectsModal
                categoryId={idOfActionRowCategory}
                isOpen={aspectsModalActive}
                setIsOpen={setAspectsModalActive}
                articleId={idOfActionRow}
                closeFunction={toggleShowAspectsModal}
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
                loading={loading}
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