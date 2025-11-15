import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import type { SxProps, Theme } from "@mui/material";

interface ButtonCustomProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "text" | "contained" | "outlined";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  size?: "small" | "medium" | "large";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  sx?: SxProps<Theme>;
  type?: "submit" | "button" | "reset";
}

const ButtonCustom: React.FC<ButtonCustomProps> = ({
  children,
  onClick,
  variant = "contained",
  color = "primary",
  size = "medium",
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  loading = false,
  sx,
  type = "submit",
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      color={color}
      size={size}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      sx={sx}
      type={type}
    >
      {children}
    </Button>
  );
};

export default ButtonCustom;
