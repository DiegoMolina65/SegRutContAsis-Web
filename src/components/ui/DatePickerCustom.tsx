import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";

interface DatePickerCustomProps {
  label: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  disabled?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  required?: boolean;
  error?: boolean;
  name?: string;
}

const DatePickerCustom: React.FC<DatePickerCustomProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  required = false,
  error = false,
  name,
}) => {

  const computedMinDate = minDate ?? dayjs().startOf("day");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DatePicker
        label={label}
        value={value}
        onChange={(newValue) => onChange(newValue)}
        disabled={disabled}
        minDate={computedMinDate}
        maxDate={maxDate}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
            required,
            error,
            name,
            size: "small",
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerCustom;
