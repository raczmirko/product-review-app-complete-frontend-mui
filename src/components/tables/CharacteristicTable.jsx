import CategoryIcon from "@mui/icons-material/Category";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Typography } from "@mui/material";
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
} from "@mui/x-data-grid";
import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import EditToolbar from "../../components/EditToolbar";
import { apiRequest } from "../../services/CrudService";
import { useNotification } from "../../services/NotificationProvider";
import { getModifiedRowDifference } from "../../util/stringUtil";
import ConfirmationDialog from "../ConfirmationDialog";
import ShowCharacteristicCategoriesModal from "../modals/CharacteristicCategoriesModal";
import CreateCharacteristicModal from "../modals/CreateCharacteristicModal";

export default function CharacteristicTable() {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  const [characteristics, setCharacteristics] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchColumn, setSearchColumn] = useState("");
  const [orderByColumn, setOrderByColumn] = useState("name");
  const [orderByDirection, setOrderByDirection] = useState("asc");
  const [loading, setLoading] = useState(false);

  const [updatePromiseArguments, setUpdatePromiseArguments] = useState(null);

  const [creationModalActive, setCreationModalActive] = useState(false);
  const [assignedCategoriesModalActive, setAssignedCategoriesModalActive] =
    useState(false);

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

  const [characteristicToAssignId, setCharacteristicToAssignId] = useState();

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
      setOrderByColumn("name");
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

    const endpoint = `${API_BASE_URL}/characteristic/search${queryParams}`;
    const requestBody = undefined;

    const result = await apiRequest(endpoint, "GET", requestBody);

    if (result.success) {
      setCharacteristics(result.data.content);
      setTotalElements(result.data.totalElements);
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

  const toggleShowCreationModal = () => {
    setCreationModalActive(!creationModalActive);
  };

  const toggleAssignedCategoriesModal = () => {
    setAssignedCategoriesModalActive(!assignedCategoriesModalActive);
  };

  // --- Error handling --- //

  const showCascadeDeleteConfirmation = (id) => () => {
    setConfirmationDialogTitle("Would you like to cascade delete?");
    setConfirmationDialogDescription(
      "Would you like to delete this characteristic along with all links between it and its categories? This cannot be reverted."
    );
    setConfirmationDialogFunction(() => cascadeDeleteEntity);
    setConfirmationDialogFunctionParams([id]);
    setConfirmationDialogOpen(true);
  };

  // --- CRUD API calls --- //

  const deleteEntity = async (id) => {
    const endpoint = `${API_BASE_URL}/characteristic/${id}/delete`;
    const requestBody = undefined;

    const result = await apiRequest(endpoint, "POST", requestBody);

    if (result.success) {
      showNotification("success", "SUCCESS: Characteristic deleted.");
      searchEntities();
    } else {
      showNotification("error", result.message);
      showCascadeDeleteConfirmation(id)();
    }
  };

  const cascadeDeleteEntity = async (id) => {
    const endpoint = `${API_BASE_URL}/characteristic/${id}/cascade-delete`;
    const requestBody = undefined;

    const result = await apiRequest(endpoint, "POST", requestBody);

    if (result.success) {
      showNotification("success", "SUCCESS: Characteristic deleted.");
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

    const endpoint = `${API_BASE_URL}/characteristic/multi-delete/${ids}`;
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

  const createEntity = async (
    name,
    unitOfMeasure,
    unitOfMeasureName,
    description
  ) => {
    const endpoint = `${API_BASE_URL}/characteristic/create`;
    const requestBody = {
      name: name,
      unitOfMeasure: unitOfMeasure,
      unitOfMeasureName: unitOfMeasureName,
      description: description,
    };

    const result = await apiRequest(endpoint, "POST", requestBody);

    if (result.success) {
      searchEntities();
      showNotification("success", "SUCCESS: Characteristic created.");
    } else {
      showNotification("error", result.message);
    }
  };

  const modifyEntity = async (newCharacteristic) => {
    const endpoint = `${API_BASE_URL}/characteristic/${newCharacteristic.id}/modify`;
    const requestBody = newCharacteristic;

    const result = await apiRequest(endpoint, "PUT", requestBody);

    if (result.success) {
      showNotification("success", "SUCCESS: Characteristic updated.");
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
      setOrderByColumn("name");
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

  const handleShowAssignmentModalClick = (id) => () => {
    setCharacteristicToAssignId(id);
    setAssignedCategoriesModalActive(true);
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
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150, editable: true },
    {
      field: "unitOfMeasure",
      headerName: "Unit of measure",
      width: 150,
      editable: true,
    },
    {
      field: "unitOfMeasureName",
      headerName: "Unit of measure name",
      width: 200,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 130,
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
          <Tooltip title={"Show assigned categories"}>
            <GridActionsCellItem
              icon={<CategoryIcon />}
              label="Categories"
              className="textPrimary"
              onClick={handleShowAssignmentModalClick(id)}
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

  const handleProcessRowUpdateError = (error) => {
    console.error("Error updating row:", error);
    showNotification("error", error.message);
  };

  return (
    <Box sx={{ height: "100%", width: "100%", bgcolor: "black" }}>
      {creationModalActive && (
        <CreateCharacteristicModal
          isOpen={creationModalActive}
          setIsOpen={setCreationModalActive}
          entityToAdd="characteristic"
          closeFunction={toggleShowCreationModal}
          createEntityFunction={createEntity}
        />
      )}
      {assignedCategoriesModalActive && (
        <ShowCharacteristicCategoriesModal
          isOpen={assignedCategoriesModalActive}
          setIsOpen={setAssignedCategoriesModalActive}
          closeFunction={toggleAssignedCategoriesModal}
          characteristicId={characteristicToAssignId}
        />
      )}
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
        onProcessRowUpdateError={handleProcessRowUpdateError}
        rows={characteristics}
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
            setmodalactive: setCreationModalActive,
            deleterecords: deleteEntities,
            rowselectionmodel: rowSelectionModel,
          },
        }}
        sx={{ "--DataGrid-overlayHeight": "300px" }}
      />
    </Box>
  );
}
