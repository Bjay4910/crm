import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Help as HelpIcon, Keyboard as KeyboardIcon } from '@mui/icons-material';
import { useKeyboardNavigation } from '../utils/useKeyboardNavigation';

/**
 * Component that displays available keyboard shortcuts 
 * and provides a help button to show them.
 */
const KeyboardShortcutsHelp: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { shortcuts } = useKeyboardNavigation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Keyboard shortcut to open help dialog
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger when typing in input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Open help dialog when pressing Shift + ?
      if (event.key === '?' && event.shiftKey) {
        event.preventDefault();
        handleOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label="Keyboard shortcuts help"
        color="inherit"
        size="small"
        sx={{ ml: 1 }}
      >
        <KeyboardIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        aria-labelledby="keyboard-shortcuts-dialog-title"
      >
        <DialogTitle id="keyboard-shortcuts-dialog-title">
          <Box display="flex" alignItems="center">
            <KeyboardIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Keyboard Shortcuts</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Press <strong>Shift + ?</strong> anytime to open this help dialog.
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" aria-label="keyboard shortcuts">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Shortcut</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shortcuts.map((shortcut, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {shortcut.keys}
                      </Typography>
                    </TableCell>
                    <TableCell>{shortcut.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Note: Shortcuts won't trigger when focused on input fields.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KeyboardShortcutsHelp;