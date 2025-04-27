import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import PageviewIcon from "@mui/icons-material/Pageview";
import SaveIcon from "@mui/icons-material/Save";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  useGridApiContext,
} from "@mui/x-data-grid";
import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import CountryService from "../../services/CountryService";
import { apiRequest } from "../../services/CrudService";
import { useNotification } from "../../services/NotificationProvider";
import { getModifiedRowDifference } from "../../util/stringUtil";
import ConfirmationDialog from "../ConfirmationDialog";
import EditToolbar from "../EditToolbarNoAdd";
import AssignReviewAspectValueModal from "../modals/AssignReviewAspectValueModal";
import ViewReviewModal from "../modals/ViewReviewModal";

export default function ReviewTable() {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  const [reviews, setReviews] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchValue, setSearchValue] = useState(
    localStorage.getItem("username")
  );
  const [searchColumn, setSearchColumn] = useState("user");
  const [orderByColumn, setOrderByColumn] = useState("date");
  const [orderByDirection, setOrderByDirection] = useState("desc");
  const [loading, setLoading] = useState(false);

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [viewReviewModalOpen, setViewReviewModalOpen] = useState(false);
  const [assignAspectValueModalOpen, setAssignAspectValueModalOpen] =
    useState(false);

  const [confirmationDialogTitle, setConfirmationDialogTitle] = useState(
    "Confirm your action!"
  );
  const [confirmationDialogDescription, setConfirmationDialogDescription] =
    useState("");
  const [confirmationDialogFunction, setConfirmationDialogFunction] =
    useState(null);
  const [
    confirmationDialogFunctionParams,
    setConfirmationDialogFunctionParams,
  ] = useState([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterModel, setFilterModel] = useState({
    items: [
      {
        field: "user",
        operator: "contains",
        value: localStorage.getItem("username"),
      },
    ],
  });
  const [sortModel, setSortModel] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState({});
  const [rowModesModel, setRowModesModel] = useState({});
  const [updatePromiseArguments, setUpdatePromiseArguments] = useState(null);

  const [quickFilterValues, setQuickFilterValues] = useState("");

  const [countries, setCountries] = useState([]);

  const [reviewToView, setReviewToView] = useState({});

  const showNotification = useNotification();

  const toggleReviewModalOpen = (review) => {
    setReviewToView(review);
    setViewReviewModalOpen(true);
  };

  const toggleAssignReviewAspectValueOpen = (review) => {
    setReviewToView(review);
    setAssignAspectValueModalOpen(true);
  };

  useEffect(() => {
    // Fetch countries when the component mounts
    CountryService.fetchCountries()
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const searchEntities = useCallback(async () => {
    if (orderByColumn === "" || orderByColumn === undefined) {
      setOrderByColumn("date");
    }
    if (orderByDirection === "" || orderByDirection === undefined) {
      setOrderByDirection("desc");
    }

    setLoading(true);

    let queryParams = `?pageSize=${pageSize}&pageNumber=${pageNumber}&orderByColumn=${orderByColumn}&orderByDirection=${orderByDirection}`;
    if (searchValue) queryParams += `&searchText=${searchValue}`;
    if (searchColumn) queryParams += `&searchColumn=${searchColumn}`;
    if (quickFilterValues)
      queryParams += `&quickFilterValues=${quickFilterValues}`;

    const endpoint = `${API_BASE_URL}/review-head/search${queryParams}`;
    const requestBody = undefined;

    const result = await apiRequest(endpoint, "GET", requestBody);

    if (result.success) {
      const reviewsWithIds = generateUniqueIds(result.data.content);
      setReviews(reviewsWithIds);
      setTotalElements(result.data.page.totalElements);
      setLoading(false);
    } else {
      showNotification("error", result.message);
    }
  }, [
    searchValue,
    searchColumn,
    pageSize,
    pageNumber,
    orderByColumn,
    orderByDirection,
    quickFilterValues,
    API_BASE_URL,
    showNotification,
  ]);

  useEffect(() => {
    searchEntities();
  }, [searchEntities]);

  function formatDate(d) {
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month starts from 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const generateUniqueIds = (reviews) => {
    return reviews.map((review) => ({
      ...review,
      id: `${review.user.username}-${review.product.id}`,
    }));
  };

  // --- CRUD API calls --- //

  const deleteEntity = async (username, productId) => {
    const endpoint = `${API_BASE_URL}/review-head/delete`;
    const requestBody = {
      username: username,
      productId: productId,
    };

    const result = await apiRequest(endpoint, "POST", requestBody);

    if (result.success) {
      showNotification("success", "SUCCESS: Review deleted.");
      searchEntities();
    } else {
      showNotification("error", result.message);
    }
  };

  const deleteEntities = async () => {
    if (rowSelectionModel === undefined || rowSelectionModel.length === 0) {
      showNotification("error", "No records are selected!");
      return;
    }

    const endpoint = `${API_BASE_URL}/review-head/multi-delete`;
    const requestBody = rowSelectionModel;

    const result = await apiRequest(endpoint, "POST", requestBody);

    if (result.success) {
      showNotification(
        "success",
        "All records have been successfully deleted."
      );
      searchEntities();
    } else {
      showNotification("error", result.message);
    }
  };

  const modifyEntity = async (newReview, username) => {
    const endpoint = `${API_BASE_URL}/review-head/${username}/${newReview.product.id}/modify`;
    const requestBody = newReview;
    if (!username) {
      showNotification(
        "error",
        "Login username cannot be found, please log in again!"
      );
    } else {
      const result = await apiRequest(endpoint, "PUT", requestBody);
      if (result.success) {
        showNotification("success", "SUCCESS: Review updated.");
        searchEntities();
      } else {
        showNotification("error", result.message);
      }
    }
  };

  const createReviewBody = async (username, product, reviewAspects) => {
    const endpoint = `${API_BASE_URL}/review-head/${username}/${product.id}/attach-review-body`;
    const requestBody = reviewAspects.filter(
      (aspect) => aspect.updated === true
    );

    const response = await apiRequest(endpoint, "POST", requestBody);

    if (response.success) {
      showNotification("success", "SUCCESS: Review aspect scores saved.");
      searchEntities();
    } else {
      showNotification("error", response.message);
    }
  };

  // --- Edit-related functionality --- //

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      setRowModesModel((prevRowModesModel) => ({
        ...prevRowModesModel,
        [params.id]: { mode: GridRowModes.View },
      }));
    }
  };

  const setRowModeToEdit = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const setRowModeToView = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
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
    []
  );

  const handleCancelModification = () => {
    const { oldRow, resolve } = updatePromiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setUpdatePromiseArguments(null);
  };

  const handleConfirmModification = async () => {
    const { newRow, oldRow, reject, resolve } = updatePromiseArguments;

    try {
      const username = localStorage.getItem("username");
      // Make the HTTP request to save in the backend
      await modifyEntity(newRow, username);
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
      <Dialog maxWidth="md" open={!!updatePromiseArguments}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" component="div">
            Pressing 'Yes' will change:
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ whiteSpace: "pre-line" }}
          >
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

  function SelectEditCountryInputCell(props) {
    const { id, value, field, options } = props;
    const apiRef = useGridApiContext();
    const [selectedCountry, setSelectedCountry] = useState(value);

    const handleChange = (event) => {
      let newCountryName = event.target.value;
      let newCountry = options.find((option) => option.name === newCountryName);
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
        {options.map((option) => (
          <option key={option.countryCode} value={option.name}>
            {option.name}
          </option>
        ))}
      </Select>
    );
  }

  function SelectEditRecommendedInputCell(props) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const [recommended, setRecommended] = useState(value);

    const handleRecommendedChange = (event) => {
      const newRecommended = event.target.checked;
      setRecommended(newRecommended);
      apiRef.current.setEditCellValue({ id, field, value: newRecommended });
      apiRef.current.stopCellEditMode({ id, field });
    };

    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={recommended}
            onChange={handleRecommendedChange}
            color="primary"
          />
        }
        label="Recommended"
      />
    );
  }

  function SelectEditValueForPriceInputCell(props) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const [valueForPrice, setValueForPrice] = useState(Number(value));

    const handleValueForPriceChange = (event, newValue) => {
      setValueForPrice(newValue);
      apiRef.current.setEditCellValue({ id, field, value: newValue });
      apiRef.current.stopCellEditMode({ id, field });
    };

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Rating value={valueForPrice} onChange={handleValueForPriceChange} />
      </Box>
    );
  }

  const renderSelectEditCountryInputCell = (params) => {
    return <SelectEditCountryInputCell {...params} />;
  };

  const renderSelectEditRecommendedInputCell = (params) => {
    return <SelectEditRecommendedInputCell {...params} />;
  };

  const renderSelectEditValueForPriceInputCell = (params) => {
    return <SelectEditValueForPriceInputCell {...params} />;
  };

  //  --- Pagination, filtering and sorting-related methods --- //

  const handleFilterChange = (filterModel) => {
    setFilterModel(filterModel);
    if (filterModel.items[0]?.value) {
      setSearchValue(filterModel.items[0].value);
    } else {
      // If filterModel's value doesn't exist (thus not filtering) set the filter to an empty string
      // To trigger the table refresh mechanism and display all records
      setSearchValue("");
    }
    if (filterModel.items[0]?.field) {
      setSearchColumn(filterModel.items[0].field);
    } else {
      setSearchColumn("");
    }
    if (filterModel.quickFilterValues) {
      setQuickFilterValues(filterModel.quickFilterValues);
    }
  };

  const handleSortChange = (sortModel) => {
    if (sortModel[0]) {
      setOrderByColumn(sortModel[0].field);
      setOrderByDirection(sortModel[0].sort);
    } else {
      // Setting the order to default when sorting is removed
      setOrderByColumn("id");
      setOrderByDirection("asc");
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
  };

  // Actions row buttons and their handlers

  const handleDeleteClick = (username, productId) => () => {
    setConfirmationDialogTitle("Are you sure want to delete?");
    setConfirmationDialogDescription("This cannot be reverted.");
    setConfirmationDialogFunction(() => deleteEntity);
    setConfirmationDialogFunctionParams([username, productId]);
    setConfirmationDialogOpen(true);
  };

  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 100,
      valueFormatter: (value, row) => formatDate(value),
    },
    {
      field: "product",
      headerName: "Product",
      width: 150,
      valueGetter: (value, row) => row.product,
      valueFormatter: (value, row) =>
        row.product.article.name + ` (${row.product.id})`,
    },
    {
      field: "user",
      headerName: "User",
      width: 100,
      valueGetter: (value, row) => row.user,
      valueFormatter: (value, row) => row.user.username,
    },
    {
      field: "recommended",
      headerName: "Recommended?",
      width: 150,
      editable: true,
      renderEditCell: (params) =>
        renderSelectEditRecommendedInputCell({ ...params }),
      valueFormatter: (value, row) => (row.recommended === true ? "YES" : "NO"),
    },
    {
      field: "purchaseCountry",
      headerName: "Bought in",
      width: 100,
      editable: true,
      renderEditCell: (params) =>
        renderSelectEditCountryInputCell({ ...params, options: countries }),
      valueGetter: (value, row) => row.purchaseCountry,
      valueFormatter: (value, row) => row.purchaseCountry.name,
    },
    {
      field: "valueForPrice",
      headerName: "Value For $",
      width: 150,
      editable: true,
      renderEditCell: (params) =>
        renderSelectEditValueForPriceInputCell({ ...params }),
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Rating value={Number(params.value)} readOnly />
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      editable: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", height: "100%" }}>{params.value}</Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 180,
      cellClassName: "actions",
      getActions: ({ row }) => {
        const isInEditMode = rowModesModel[row.id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <Tooltip title={"Save row"}>
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                onClick={setRowModeToView(row.id)}
              />
            </Tooltip>,
            <Tooltip title={"Cancel modifications"}>
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(row.id)}
              />
            </Tooltip>,
          ];
        }
        return [
          <Tooltip title={"Change aspect score"}>
            <GridActionsCellItem
              icon={<StarOutlineIcon />}
              label="Change aspect score"
              className="textPrimary"
              onClick={() => toggleAssignReviewAspectValueOpen(row)}
            />
          </Tooltip>,
          <Tooltip title={"View review"}>
            <GridActionsCellItem
              icon={<PageviewIcon />}
              label="View"
              className="textPrimary"
              onClick={() => toggleReviewModalOpen(row)}
            />
          </Tooltip>,
          <Tooltip title={"Edit row"}>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={setRowModeToEdit(row.id)}
            />
          </Tooltip>,
          <Tooltip title={"Delete row"}>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(row.user.username, row.product.id)}
            />
          </Tooltip>,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", bgcolor: "black" }}>
      {confirmationDialogOpen && (
        <ConfirmationDialog
          dialogTitle={confirmationDialogTitle}
          dialogDescription={confirmationDialogDescription}
          isOpen={confirmationDialogOpen}
          setIsOpen={setConfirmationDialogOpen}
          functionToRunOnConfirm={confirmationDialogFunction}
          functionParams={confirmationDialogFunctionParams}
        />
      )}
      {viewReviewModalOpen && (
        <ViewReviewModal
          review={reviewToView}
          isOpen={viewReviewModalOpen}
          setIsOpen={setViewReviewModalOpen}
        />
      )}
      {assignAspectValueModalOpen && (
        <AssignReviewAspectValueModal
          review={reviewToView}
          isOpen={assignAspectValueModalOpen}
          setIsOpen={setAssignAspectValueModalOpen}
          createReviewBody={createReviewBody}
        />
      )}
      {renderConfirUpdateDialog()}
      <DataGrid
        autoHeight
        editMode="row"
        rowModesModel={rowModesModel}
        rows={reviews}
        rowCount={totalElements}
        columns={columns}
        loading={loading}
        filterMode="server"
        sortingMode="server"
        paginationMode="server"
        onRowSelectionModelChange={handleRowSelectionModelChange}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
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
            sortModel: sortModel,
          },
          density: "comfortable",
        }}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            deleterecords: deleteEntities,
            rowselectionmodel: rowSelectionModel,
          },
        }}
        sx={{ "--DataGrid-overlayHeight": "400px" }}
      />
    </Box>
  );
}
