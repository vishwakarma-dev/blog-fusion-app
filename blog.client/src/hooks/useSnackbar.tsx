import SnackbarAlert from '@Blog/components/SnackbarAlert';
import { useCallback, useState } from 'react';

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning',
  });

  const showSnackbar = useCallback(
    (message: string, severity: typeof snackbar.severity = 'info') => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  const SnackbarComponent = (
    <SnackbarAlert
      open={snackbar.open}
      message={snackbar.message}
      severity={snackbar.severity}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
    />
  );

  return { showSnackbar, SnackbarComponent };
};
