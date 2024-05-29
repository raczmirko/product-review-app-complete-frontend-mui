import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import QuizIcon from '@mui/icons-material/Quiz';
import StyleIcon from '@mui/icons-material/Style';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes,
    useGridApiContext
} from '@mui/x-data-grid';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/CrudService';
import ProductImageService from '../../services/ProductImageService';
import AlertSnackBar from '../AlertSnackBar';
import ConfirmationDialog from '../ConfirmationDialog';
import EditToolbar from '../EditToolbar';
import AssignCharacteristicValue from '../modals/AssignCharacteristicValueModal';
import ListAspectsModal from '../modals/ListAspectsModal';
import ListCharacteristicsModal from '../modals/ListCharacteristicsModal';
import CreateProductModal from '../modals/AssignCharacteristicValueModal';

export default function ArticleTable() {

    const [products, setProducts] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState('');
    const [totalElements, setTotalElements] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [searchColumn, setSearchColumn] = useState('');
    const [searchOperator, setSearchOperator] = useState('');
    const [orderByColumn, setOrderByColumn] = useState('id');
    const [orderByDirection, setOrderByDirection] = useState('asc');
    const [loading, setLoading] = useState(false);

    const [createProductModalActive, setCreateProductModalActive] = useState(false);
    const [characteristicsModalActive, setCharacteristicsModalActive] = useState(false);
    const [aspectsModalActive, setAspectsModalActive] = useState(false);

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

    const [endtityId, setEntityId] = useState('');
    const [idOfActionRowCategory, setIdOfActionRowCategory] = useState(undefined);
    const [product, setProduct] = useState(undefined);

    function showSnackBar (status, text) {
        setSnackBarOpen(true);
        setSnackBarStatus(status);
        setSnackBarText(text);
    }

    useEffect(() => {
        searchEntities();
    }, [searchValue, searchColumn, pageSize, pageNumber, orderByColumn, orderByDirection, quickFilterValues, filterModel]);

    // --- Modal-related functions --- //

    const toggleShowCreateProductModal = (id) => () => {
        setEntityId(id);
        setCreateProductModalActive(!createProductModalActive);
    }

    const toggleShowCharacteristicsModal = (id) => () => {
        let product = products.find(product => product.id === id);
        setProduct(product);
        setCharacteristicsModalActive(!characteristicsModalActive);
    }

    const toggleShowAspectsModal = (id) => () => {
        setEntityId(id);
        let categoryId = products.find((product) => product.id === id).article.category.id;
        setIdOfActionRowCategory(categoryId);
        setAspectsModalActive(!aspectsModalActive);
    }

    // --- CRUD API calls --- //

    const deleteEntity = async (id) => {
        const endpoint = `http://localhost:8080/product/${id}/delete`;
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

        const endpoint = `http://localhost:8080/product/multi-delete/${ids}`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'POST', requestBody);
    
        if (result.success) {
            showSnackBar('success', 'All records have been successfully deleted.');
            searchEntities();
        } else {
            showSnackBar('error', result.message);
        }
    };

    const createProduct = async (article, packaging) => {
        if (packaging === '') {
            let errorMessage = 'ERROR: Packaging cannot be empty.';
            showSnackBar('error', errorMessage);
            return { success: false, message: errorMessage };
        }
        else {
            const endpoint = 'http://localhost:8080/product/create';
            const requestBody = {
                article: article,
                packaging: packaging
            };
        
            const response = await apiRequest(endpoint, 'POST', requestBody);
        
            if (response.success) {
                showSnackBar('success', 'Product successfully created.');
                return { success: true, product:  response.data };
            } else {
                showSnackBar('error', response.message);
                return { success: false, message: response.message };
            }
        }
    };

    const uploadProductImages = async (productId, images) => {
        
        const response = await ProductImageService.uploadProductImages(productId, images);
    
        if (response.success) {
            showSnackBar('success', 'Product images successfully uploaded.');
        } else {
            showSnackBar('error', 'Error during image upload.');
        }
    };

    const assignCharacteristicValueFunction = async (product, characteristic, value) => {
        const endpoint = 'http://localhost:8080/product-characteristic-value/create';
        const requestBody = {
            product: product,
            characteristic: characteristic,
            value: value
        };
    
        const response = await apiRequest(endpoint, 'POST', requestBody);
    
        if (response.success) {
            showSnackBar('success', 'Product successfully created.');
            return { success: true, productId:  response.data };
        } else {
            showSnackBar('error', response.message);
            return { success: false, message: response.message };
        }
    }

    const searchEntities = async () => {
        if (orderByColumn === '' || orderByColumn === undefined) {setOrderByColumn('id')};
        if (orderByDirection === '' || orderByDirection === undefined) {setOrderByDirection('asc')};

        setLoading(true);

        let queryParams = `?pageSize=${pageSize}&pageNumber=${pageNumber}&orderByColumn=${orderByColumn}&orderByDirection=${orderByDirection}`;
        if (searchValue) queryParams += `&searchText=${searchValue}`;
        if (searchColumn) queryParams += `&searchColumn=${searchColumn}`;
        if (quickFilterValues) queryParams += `&quickFilterValues=${quickFilterValues}`;

        const endpoint = `http://localhost:8080/product/search${queryParams}`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);
    
        if (result.success) {
            setProducts(result.data.content);
            setTotalPages(result.data.totalPages);
            setTotalElements(result.data.totalElements);
            setLoading(false);
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
            setOrderByColumn('id');
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
        {
            field: 'article',
            headerName: 'Article',
            width: 150,
            valueGetter: (value, row) => {
                return row.article;
            },
            valueFormatter: (value, row) => row.article.name
        },
        {
            field: 'articleCategory',
            headerName: 'Category',
            width: 150,
            valueGetter: (value, row) => {
                return row.article;
            },
            valueFormatter: (value, row) => row.article.category.name
        },
        {
            field: 'packaging',
            headerName: 'Packaging',
            flex:1,
            valueGetter: (value, row) => {
                return row.packaging;
            },
            valueFormatter: (value, row) => row.packaging.name
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 200,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                <Tooltip title={'Show assigned characteristics'}>
                    <GridActionsCellItem
                        icon={<StyleIcon />}
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
            <AlertSnackBar alertType={snackBarStatus} alertText={snackBarText} isOpen={snackBarOpen} setIsOpen={setSnackBarOpen}/>
            {createProductModalActive && <CreateProductModal
                isOpen={createProductModalActive}
                setIsOpen={setCreateProductModalActive}
                articleId={endtityId}
                closeFunction={toggleShowCreateProductModal}
                createFunction={createProduct}
                uploadImageFunction={uploadProductImages}
                assignCharacteristicValueFunction={assignCharacteristicValueFunction}
            />}
            {characteristicsModalActive && <AssignCharacteristicValue
                isOpen={characteristicsModalActive}
                setIsOpen={setCharacteristicsModalActive}
                product={product}
                closeFunction={toggleShowCharacteristicsModal}
                assignCharacteristicValueFunction={assignCharacteristicValueFunction}
            />}
            {aspectsModalActive && <ListAspectsModal
                categoryId={idOfActionRowCategory}
                isOpen={aspectsModalActive}
                setIsOpen={setAspectsModalActive}
                articleId={endtityId}
                closeFunction={toggleShowAspectsModal}
            />}
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
                rows={products}
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
                        deleterecords: deleteEntities,
                        rowselectionmodel: rowSelectionModel
                    },
                }}
                sx={{ '--DataGrid-overlayHeight': '300px' }}
            />
        </Box>
        
    );
}