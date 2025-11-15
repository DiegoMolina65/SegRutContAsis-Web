import * as React from "react";
import { Snackbar, Alert } from "@mui/material";
import type { AlertColor } from "@mui/material";

interface SnackBarCustomProps {
  open: boolean;
  message: string;
  severity?: AlertColor; // "success" | "error" | "warning" | "info"
  autoHideDuration?: number;
  onClose: () => void;
  position?:
    | { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" }
    | undefined;
}

const SnackBarCustom: React.FC<SnackBarCustomProps> = ({
  open,
  message,
  severity = "info",
  autoHideDuration = 4000,
  onClose,
  position = { vertical: "bottom", horizontal: "center" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 2,
          fontWeight: 500,
          boxShadow: 3,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBarCustom;
