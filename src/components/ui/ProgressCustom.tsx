import React from "react";
import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";

interface ProgressCustomProps {
  type?: "linear" | "circular";
  value?: number; // Si se pasa, el progreso será determinado, si no, indeterminado
  showLabel?: boolean;
  label?: string;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  size?: number; // Solo aplica para circular
  thickness?: number; // Solo aplica para circular
  sx?: object;
}

const ProgressCustom: React.FC<ProgressCustomProps> = ({
  type = "circular",
  value,
  showLabel = false,
  label,
  color = "primary",
  size = 50,
  thickness = 4,
  sx = {},
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", ...sx }}
    >
      {type === "circular" ? (
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant={value !== undefined ? "determinate" : "indeterminate"}
            value={value}
            color={color}
            size={size}
            thickness={thickness}
          />
          {showLabel && value !== undefined && (
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                {`${Math.round(value)}%`}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box width="100%">
          {label && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {label}
            </Typography>
          )}
          <LinearProgress
            variant={value !== undefined ? "determinate" : "indeterminate"}
            value={value}
            color={color}
            sx={{ height: 8, borderRadius: 5 }}
          />
          {showLabel && value !== undefined && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block", textAlign: "right" }}
            >
              {`${Math.round(value)}%`}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProgressCustom;
