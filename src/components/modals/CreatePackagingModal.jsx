import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import ModalButton from "../buttons/ModalButton";

const CreatePackagingModal = ({
  closeFunction,
  createEntityFunction,
  isOpen,
  setIsOpen,
}) => {
  const [name, setName] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [unitOfMeasureName, setUnitOfMeasureName] = useState("");
  const [size, setSize] = useState("");
  const [amount, setAmount] = useState(1);

  const handleClose = () => {
    setIsOpen(false);
    closeFunction();
    setName(undefined);
    setUnitOfMeasure(undefined);
    setUnitOfMeasureName(undefined);
    setSize(undefined);
    setAmount(undefined);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createEntityFunction(name, unitOfMeasure, unitOfMeasureName, size, amount);
    handleClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="create-packaging-modal"
      aria-describedby="modal-to-create-packaging"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "30%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          outline: "1px solid #81be83",
        }}
      >
        <Typography variant="h5" component="div" gutterBottom>
          New packaging
        </Typography>
        <form onSubmit={handleCreate}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            autoFocus
            fullWidth
            required
            inputProps={{ maxLength: 100 }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 100 }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            fullWidth
            required
            InputLabelProps={{
              maxLength: 100,
              shrink: true,
            }}
          />
          <TextField
            label="Unit of measure"
            helperText="E.g.: kg"
            value={unitOfMeasure}
            onChange={(e) => setUnitOfMeasure(e.target.value)}
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 100 }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Unit of measure name"
            helperText="E.g.: Kilogram"
            value={unitOfMeasureName}
            onChange={(e) => setUnitOfMeasureName(e.target.value)}
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 100 }}
            sx={{ mb: 2 }}
          />
          <Box sx={{ textAlign: "right" }}>
            <ModalButton
              buttonText="save"
              colorParam="success"
              onClickParam={handleCreate}
            />
            <ModalButton
              buttonText="close"
              colorParam="secondary"
              onClickParam={handleClose}
            />
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreatePackagingModal;
