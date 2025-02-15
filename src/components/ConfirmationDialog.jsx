import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import * as React from "react";
import Draggable from "react-draggable";

function PaperComponent(props) {
  const nodeRef = React.useRef(null);
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={nodeRef}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

export default function ConfirmationDialog({
  dialogTitle,
  dialogDescription,
  isOpen,
  setIsOpen,
  functionToRunOnConfirm,
  functionParams,
}) {
  const handleConfirm = () => {
    setIsOpen(false);
    functionToRunOnConfirm(...functionParams);
  };

  return (
    <Dialog
      open={isOpen}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogDescription}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirm} color="warning" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
