import React from "react";
import { Card, CardContent, CardActions, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface CardCustomProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  sx?: SxProps<Theme>;
  elevation?: number;
}

const CardCustom: React.FC<CardCustomProps> = ({
  title,
  children,
  actions,
  sx,
  elevation = 3,
}) => {
  return (
    <Card sx={{ borderRadius: 2, p: 1, ...sx }} elevation={elevation}>
      {title && (
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
      )}
      <CardContent sx={{ padding: "8px 16px" }}>{children}</CardContent>
      {actions && <CardActions sx={{ padding: "8px 16px" }}>{actions}</CardActions>}
    </Card>
  );
};

export default CardCustom;
