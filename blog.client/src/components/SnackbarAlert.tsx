import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Theme,
  SxProps
} from '@mui/material';

export interface SnackbarAlertProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  autoHideDuration?: number;
  onClose: () => void;
}

const getBorderColor = (severity: SnackbarAlertProps['severity'], theme: Theme): string => {
  switch (severity) {
    case 'success':
      return theme.palette.success.main;
    case 'error':
      return theme.palette.error.main;
    case 'warning':
      return theme.palette.warning.main;
    case 'info':
    default:
      return theme.palette.info.main;
  }
};

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  open,
  message,
  severity,
  autoHideDuration = 3000,
  onClose,
}) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="standard"
        sx={(theme) => ({
          minWidth: 400,
          border: `1px solid ${getBorderColor(severity, theme)}`,
        })}
      >
        <AlertTitle fontWeight={800}>
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
