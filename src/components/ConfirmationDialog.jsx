import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function ConfirmationDialog({ dialogTitle, dialogDescription, isOpen, setIsOpen, functionToRunOnConfirm }) {

    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {dialogDescription}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button
                onClick={() => {
                    setIsOpen(false);
                    functionToRunOnConfirm();
                }}
                color="warning"
                autoFocus
            >
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
    );
}