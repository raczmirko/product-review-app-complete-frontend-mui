import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import {
    DataGrid,
    GridActionsCellItem
} from '@mui/x-data-grid';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/CrudService';
import AlertSnackBar from '../AlertSnackBar';
import EditToolbar from '../EditToolbarNoAdd';


export default function ReviewTable() {

    const [reviews, setReviews] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState('');
    const [totalElements, setTotalElements] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [searchColumn, setSearchColumn] = useState('');
    const [searchOperator, setSearchOperator] = useState('');
    const [orderByColumn, setOrderByColumn] = useState('date');
    const [orderByDirection, setOrderByDirection] = useState('desc');
    const [loading, setLoading] = useState(false);

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
    const [rowSelectionModel, setRowSelectionModel] = useState({});

    const [quickFilterValues, setQuickFilterValues] = useState('');
    
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarText, setSnackBarText] = useState('');
    const [snackBarStatus, setSnackBarStatus] = useState('info');

    const [endtityId, setEntityId] = useState('');
    const [idOfActionRowCategory, setIdOfActionRowCategory] = useState(undefined);

    function showSnackBar (status, text) {
        setSnackBarOpen(true);
        setSnackBarStatus(status);
        setSnackBarText(text);
    }

    useEffect(() => {
        searchEntities();
    }, [searchValue, searchColumn, pageSize, pageNumber, orderByColumn, orderByDirection, quickFilterValues, filterModel]);

    function formatDate(d) {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    }

    // --- CRUD API calls --- //

    const deleteEntity = async (userId, productId) => {
        const endpoint = `http://localhost:8080/review-head/delete`;
        const requestBody = {
            userId: userId,
            productId: productId
        };
    
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

    const searchEntities = async () => {
        if (orderByColumn === '' || orderByColumn === undefined) {setOrderByColumn('date')};
        if (orderByDirection === '' || orderByDirection === undefined) {setOrderByDirection('desc')};

        setLoading(true);

        let queryParams = `?pageSize=${pageSize}&pageNumber=${pageNumber}&orderByColumn=${orderByColumn}&orderByDirection=${orderByDirection}`;
        if (searchValue) queryParams += `&searchText=${searchValue}`;
        if (searchColumn) queryParams += `&searchColumn=${searchColumn}`;
        if (quickFilterValues) queryParams += `&quickFilterValues=${quickFilterValues}`;

        const endpoint = `http://localhost:8080/review-head/search${queryParams}`;
        const requestBody = undefined;
    
        const result = await apiRequest(endpoint, 'GET', requestBody);
    
        if (result.success) {
            setReviews(result.data.content);
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
    
    // Actions row buttons and their handlers
    
    const handleDeleteClick = (userId, productId) => () => {
        setConfirmationDialogTitle("Are you sure want to delete?");
        setConfirmationDialogDescription("This cannot be reverted.");
        setConfirmationDialogFunction(() => deleteEntity);
        setConfirmationDialogFunctionParams([userId, productId]);
        setConfirmationDialogOpen(true);
    };

    const columns = [
        { 
            field: 'date', 
            headerName: 'Date', 
            width: 100,
            valueFormatter: (value, row) => formatDate(value),
        },
        {
            field: 'product',
            headerName: 'Product',
            width: 150,
            valueGetter: (value, row) => {
                return row.product;
            },
            valueFormatter: (value, row) => row.product.article.name
        },
        {
            field: 'user',
            headerName: 'User',
            width: 100,
            valueGetter: (value, row) => {
                return row.user;
            },
            valueFormatter: (value, row) => row.user.username
        },
        { 
            field: 'recommended', 
            headerName: 'Recommended?', 
            width: 150 ,
            valueFormatter: (value, row) => row.recommended === true ? 'YES' : 'NO'
        },
        {
            field: 'purchaseCountry',
            headerName: 'Bought in',
            width: 100,
            valueGetter: (value, row) => {
                return row.purchaseCountry;
            },
            valueFormatter: (value, row) => row.purchaseCountry.name
        },
        { 
            field: 'valueForPrice', 
            headerName: 'Value For $', 
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Rating value={params.value} readOnly />
                </Box>
            ),
        },
        { 
            field: 'description', 
            headerName: 'Description', 
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', height: '100%' }}>
                    {params.value}
                </Box>
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: (value, row) => {
                return [
                    <Tooltip title={'Delete row'}>
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={handleDeleteClick(null, null)}
                        />
                    </Tooltip>,
                ];
            }
    }];

    return (
        <Box sx={{ height: '100%', width: '100%', bgcolor:'black' }}>
            <AlertSnackBar alertType={snackBarStatus} alertText={snackBarText} isOpen={snackBarOpen} setIsOpen={setSnackBarOpen}/>
            <DataGrid
                autoHeight
                editMode="row" 
                rows={reviews}
                rowCount={totalElements}
                columns={columns}
                loading={loading}
                filterMode="server"
                sortingMode="server"
                paginationMode="server"
                onRowSelectionModelChange={handleRowSelectionModelChange}
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
                    },
                    density: 'comfortable'
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
                sx={{ '--DataGrid-overlayHeight': '400px' }}
            />
        </Box>
        
    );
}