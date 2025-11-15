import React, { useState, useMemo } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  OutlinedInput,
  TextField,
  Box,
  InputAdornment,
  ListSubheader,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import type { SelectChangeEvent, SxProps, Theme } from "@mui/material";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectCustomProps {
  label: string;
  value: string | number | string[] | number[] | null | undefined;
  onChange: (value: string | number | string[] | number[] | null) => void;
  options?: SelectOption[];
  multiple?: boolean;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  renderValue?: (selected: any) => React.ReactNode;
  input?: React.ReactElement<typeof OutlinedInput>;
  children?: React.ReactNode;
}

const SelectCustom: React.FC<SelectCustomProps> = ({
  label,
  value,
  onChange,
  options,
  multiple = false,
  error = false,
  helperText = "",
  sx,
  renderValue,
  input,
  children,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleChange = (event: SelectChangeEvent<any>) => {
    let selectedValue = event.target.value;

    if (multiple) {
      onChange(selectedValue);
    } else {
      if (selectedValue === "") {
        onChange(null);
      } else {
        // Intentamos convertir a número si es posible
        const parsed = Number(selectedValue);
        onChange(isNaN(parsed) ? selectedValue : parsed);
      }
    }
  };

  const filteredOptions = useMemo(() => {
    if (!searchText) return options;
    return options?.filter((option) =>
      option.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchText]);

  const selectValue = useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : [];
    return value ?? "";
  }, [value, multiple]);

  return (
    <FormControl fullWidth variant="outlined" error={error} sx={{ mb: 2, ...sx }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple={multiple}
        value={selectValue}
        onChange={handleChange}
        label={label}
        renderValue={renderValue}
        input={input ?? <OutlinedInput label={label} />}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 400, "& .MuiList-root": { py: 0 } },
          },
          autoFocus: false,
        }}
        onClose={() => setSearchText("")}
        sx={{
          "& .MuiOutlinedInput-root": { backgroundColor: "#f8fafc" },
          ...sx,
        }}
      >
        {/* 🔍 Campo de búsqueda */}
        <ListSubheader
          sx={{
            py: 1,
            px: 2,
            backgroundColor: "white",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar..."
            fullWidth
            autoFocus
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f8fafc",
                fontSize: "0.875rem",
              },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ color: "#94a3b8", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </ListSubheader>

        {!multiple && (
          <MenuItem value="" sx={{ py: 1.5, fontSize: "0.875rem" }}>
            <em style={{ color: "#94a3b8" }}>NINGUNO</em>
          </MenuItem>
        )}

        {/* 📋 Opciones filtradas */}
        {children ??
          filteredOptions?.map((option, index) => (
            <MenuItem
              key={option.value ?? index}
              value={option.value ?? ""}
              sx={{
                py: 1.5,
                px: 2,
                fontSize: "0.875rem",
                "&:hover": { backgroundColor: "#f8fafc" },
                "&.Mui-selected": {
                  backgroundColor: "#f1f5f9",
                  "&:hover": { backgroundColor: "#e2e8f0" },
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}

        {/* ⚠️ No se encontraron resultados */}
        {filteredOptions?.length === 0 && !children && (
          <MenuItem disabled sx={{ py: 2, justifyContent: "center" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#94a3b8",
              }}
            >
              <SearchOutlined sx={{ fontSize: 32, mb: 1, opacity: 0.5 }} />
              <span style={{ fontSize: "0.875rem" }}>No se encontraron resultados</span>
            </Box>
          </MenuItem>
        )}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectCustom;
