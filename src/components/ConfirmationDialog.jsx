import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export default function ConfirmationDialog({ dialogTitle, dialogDescription, isOpen, setIsOpen, functionToRunOnConfirm }) {
    
      const handleConfirm = () => {
        setIsOpen(false);
        functionToRunOnConfirm();
    };    

    return (
    <Dialog
        open={isOpen}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
    >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            {dialogTitle}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                {dialogDescription}
            </DialogContentText>
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