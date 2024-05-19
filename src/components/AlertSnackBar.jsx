import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';

export default function AlertSnackBar({ alertType, alertText, isOpen, setIsOpen }) {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
  };

  return (
    <div>
      <Snackbar open={isOpen} autoHideDuration={10000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertType}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertText}
        </Alert>
      </Snackbar>
    </div>
  );
}