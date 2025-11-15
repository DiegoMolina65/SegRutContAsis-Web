import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalCustomProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  disableConfirm?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  hideActions?: boolean;
}

const ModalCustom: React.FC<ModalCustomProps> = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  disableConfirm = false,
  maxWidth = "sm",
  hideActions = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 6,
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" px={2} pt={2}>
        <DialogTitle sx={{ p: 0, fontWeight: 600, fontSize: "1.25rem" }}>
          {title || "Detalles"}
        </DialogTitle>
        <IconButton onClick={onClose} size="small" color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ my: 1 }} />

      <DialogContent dividers>
        <Typography component="div">{children}</Typography>
      </DialogContent>

      {!hideActions && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              variant="contained"
              color="primary"
              onClick={onConfirm}
              disabled={disableConfirm}
            >
              {confirmText}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModalCustom;
