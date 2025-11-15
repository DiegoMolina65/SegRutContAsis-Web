import React from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps, SxProps, Theme } from "@mui/material";

interface InputTextCustomProps extends Omit<TextFieldProps, "variant"> {
  label?: string;
  value: string | number | null | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
}

const InputTextCustom: React.FC<InputTextCustomProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText = "",
  sx,
  type = "text",
  ...rest
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      type={type}
      fullWidth
      variant="outlined"
      sx={{ mb: 2, ...sx }}
      {...rest}
    />
  );
};

export default InputTextCustom;
