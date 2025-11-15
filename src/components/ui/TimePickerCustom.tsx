import * as React from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FormHelperText, FormControl } from "@mui/material";
import  { Dayjs } from "dayjs";

interface TimePickerCustomProps {
  label?: string;
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  format?: string;
  name?: string;
}

const TimePickerCustom: React.FC<TimePickerCustomProps> = ({
  label = "Seleccionar hora",
  value = null,
  onChange,
  disabled = false,
  fullWidth = true,
  required = false,
  error = false,
  helperText,
  format = "HH:mm",
  name,
}) => {
  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <TimePicker
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        ampm={false}
        format={format}
        slotProps={{
          textField: {
            fullWidth,
            required,
            error,
            name,
            helperText,
          },
        }}
      />
      {helperText && (
        <FormHelperText sx={{ ml: 1 }}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default TimePickerCustom;
