import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'countryOfOrigin',
    headerName: 'Nationality',
    width: 150,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 500,
    editable: true,
  },
];

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

    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10,
      });
    const [filterModel, setFilterModel] = React.useState({ items: [] });
    const [sortModel, setSortModel] = React.useState([]);      

    const transformedBrands = brands.map(brand => ({
        id: brand.id,
        name: brand.name,
        countryOfOrigin: brand.countryOfOrigin.name,
        description: brand.description
    }));

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

    const fetchBrands = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        try {
            const response = await fetch('http://localhost:8080/brand/all', { headers });
            const errorMessage = getNotificationTextByStatusCode(response.status);
            if (!response.ok) {
                //setNotification({ type: "error", title:"error", text: "Failed to fetch brands with an error code " + errorMessage});
                throw new Error(errorMessage);
            }
            const data = await response.json();
            setBrands(data);
            return;
        } catch (error) {
            console.error('Error fetching brands:', error);
            //setNotification({ type: "error", title:"error", text: error});
            return []; // Return an empty array if an error occurs
        }
    };

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

    const modifyBrand = async () => {};

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

        try {
            const response = await fetch(`http://localhost:8080/brand/search${queryParams}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorMessage = 'Failed to find brands.';
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
        setFilterModel(filterModel);
        if(filterModel.items[0].value){setSearchValue(filterModel.items[0].value)};
        if(filterModel.items[0].field){setSearchColumn(filterModel.items[0].field)};
        if(filterModel.items[0].operator){setSearchOperator(filterModel.items[0].operator)};
    };

    const handleSortChange = (sortModel) => {
        setSortModel(sortModel);
        if(sortModel[0]){
            setOrderByColumn(sortModel[0].field);
            setOrderByDirection(sortModel[0].sort);
        }       
    };

    const handlePaginationChange = (paginationModel) => {
        setPaginationModel(paginationModel);
        setPageSize(paginationModel.pageSize);
        setPageNumber(paginationModel.page + 1);
    };

    useEffect(() => {
        searchBrands();
    }, [searchValue, searchColumn, pageSize, pageNumber, orderByColumn, orderByDirection]);

    return (
        <Box sx={{ height: '100%', width: '100%', bgcolor:'black' }}>
        <DataGrid
            autoHeight
            editMode="row" 
            rows={transformedBrands}
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
            sx={{ '--DataGrid-overlayHeight': '300px' }}
        />
        </Box>
    );
}