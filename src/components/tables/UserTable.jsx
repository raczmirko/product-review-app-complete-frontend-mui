import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  useGridApiContext,
} from "@mui/x-data-grid";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import EditToolbar from "../../components/EditToolbar";
import { apiRequest } from "../../services/CrudService";
import { useNotification } from "../../services/NotificationProvider";
import { activateDeactivateUser } from "../../services/UserService";
import { getModifiedRowDifference } from "../../util/stringUtil";
import ConfirmationDialog from "../ConfirmationDialog";

export default function UserTable() {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchColumn, setSearchColumn] = useState("");
  const [orderByColumn, setOrderByColumn] = useState("username");
  const [orderByDirection, setOrderByDirection] = useState("asc");
  const [loading, setLoading] = useState(false);

  const [updatePromiseArguments, setUpdatePromiseArguments] = useState(null);

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
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
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [rowSelectionModel, setRowSelectionModel] = useState({});

  const [quickFilterValues, setQuickFilterValues] = useState("");

  const showNotification = useNotification();

  const searchEntities = useCallback(async () => {
    if (orderByColumn === "" || orderByColumn === undefined) {
      setOrderByColumn("username");
    }
    if (orderByDirection === "" || orderByDirection === undefined) {
      setOrderByDirection("asc");
    }

    setLoading(true);

    let queryParams = `?pageSize=${pageSize}&pageNumber=${pageNumber}&orderByColumn=${orderByColumn}&orderByDirection=${orderByDirection}`;
    if (searchValue) queryParams += `&searchText=${searchValue}`;
    if (searchColumn) queryParams += `&searchColumn=${searchColumn}`;
    if (quickFilterValues)
      queryParams += `&quickFilterValues=${quickFilterValues}`;

    const endpoint = `${API_BASE_URL}/user/search${queryParams}`;
    const requestBody = undefined;

    const result = await apiRequest(endpoint, "GET", requestBody);

    if (result.success) {
      setUsers(
        result.data.content.map((user) => ({
          ...user,
          id: user.username,
        }))
      );
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

  // --- CRUD API calls --- //

  const deleteEntity = async (id) => {
    const endpoint = `${API_BASE_URL}/user/${id}/delete`;
    const requestBody = undefined;

    const result = await apiRequest(endpoint, "POST", requestBody);

    if (result.success) {
      showNotification("success", "SUCCESS: Country deleted.");
      searchEntities();
    } else {
      showNotification("error", result.message);
    }
  };

  const deleteEntities = async (ids) => {
    if (rowSelectionModel === undefined || rowSelectionModel.length === 0) {
      showNotification("error", "No records are selected!");
      return;
    }

    const endpoint = `${API_BASE_URL}/user/multi-delete/${ids}`;
    const requestBody = undefined;

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

  const modifyEntity = async (modifiedUser) => {
    const result = await activateDeactivateUser(
      modifiedUser.username,
      modifiedUser.isActive
    );

    if (result.success) {
      showNotification("success", "SUCCESS: User updated.");
      searchEntities();
    } else {
      showNotification("error", result.message);
    }
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
      setOrderByColumn("username");
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

  // --- Edit-related functionality --- //

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      setRowModesModel((prevRowModesModel) => ({
        ...prevRowModesModel,
        [params.id]: { mode: GridRowModes.View },
      }));
    }
  };

  function SelectEditIsActiveInputCell(props) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const [isActive, setIsActive] = useState(value);

    const handleIsActiveChange = (event) => {
      const newIsActive = event.target.checked;
      setIsActive(newIsActive);
      apiRef.current.setEditCellValue({ id, field, value: newIsActive });
      apiRef.current.stopCellEditMode({ id, field });
    };

    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={isActive}
            onChange={handleIsActiveChange}
            color="primary"
          />
        }
        label="Active"
      />
    );
  }

  const renderSelectEditIsActiveInputCell = (params) => {
    return <SelectEditIsActiveInputCell {...params} />;
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
      // Make the HTTP request to save in the backend
      await modifyEntity(newRow);
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
      <Dialog maxWidth="xs" open={!!updatePromiseArguments}>
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

  const columns = [
    { field: "username", headerName: "Username", flex: 1, editable: false },
    {
      field: "isActive",
      headerName: "Enabled",
      flex: 1,
      editable: true,
      renderEditCell: (params) =>
        renderSelectEditIsActiveInputCell({ ...params }),
      valueFormatter: (value, row) => (row.isActive === true ? "YES" : "NO"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <Tooltip title={"Save row"}>
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                onClick={setRowModeToView(id)}
              />
            </Tooltip>,
            <Tooltip title={"Cancel modifications"}>
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
          <Tooltip title={"Edit row"}>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={setRowModeToEdit(id)}
            />
          </Tooltip>,
          <Tooltip title={"Delete row"}>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
            />
          </Tooltip>,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", bgcolor: "black" }}>
      {renderConfirUpdateDialog()}
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
      <DataGrid
        autoHeight
        editMode="row"
        rowModesModel={rowModesModel}
        onRowSelectionModelChange={handleRowSelectionModelChange}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        rows={users}
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
            sortModel: sortModel,
          },
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
        sx={{ "--DataGrid-overlayHeight": "300px" }}
      />
    </Box>
  );
}
