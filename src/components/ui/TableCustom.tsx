import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TablePagination,
  TextField,
  Box,
  Tooltip,
} from "@mui/material";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@mui/icons-material";

export interface Column<T> {
  field: keyof T;
  headerName: string;
  width?: number;
  render?: (row: T) => React.ReactNode;
}

interface TableCustomProps<T> {
  columns: Column<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  title?: string;
  searchField?: keyof T;
  getRowId?: (row: T) => number | string; 
}

const TableCustom = <T extends { id: number | string }>({
  columns,
  rows,
  onEdit,
  onDelete,
  title,
  searchField,
  getRowId,
}: TableCustomProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchField || searchTerm === "") return rows;
    return rows.filter((row: T) =>
      String(row[searchField])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm, searchField]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  return (
    <Paper elevation={0} sx={{ width: "100%", overflow: "hidden", backgroundColor: "transparent" }}>
      {(title || searchField) && (
        <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0", backgroundColor: "#fafafa" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
            }}
          >
            {title && (
              <Box>
                <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 600, fontSize: "1.125rem" }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                  {filteredRows.length} {filteredRows.length === 1 ? "registro" : "registros"}
                </Typography>
              </Box>
            )}
            {searchField && (
              <TextField
                placeholder="Buscar..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: { xs: "100%", sm: 250 }, "& .MuiOutlinedInput-root": { backgroundColor: "white" } }}
                InputProps={{
                  startAdornment: <SearchOutlined sx={{ color: "#94a3b8", fontSize: 20, mr: 1 }} />,
                }}
              />
            )}
          </Box>
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f8fafc",
                "& .MuiTableCell-head": {
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: "2px solid #e2e8f0",
                  py: 2,
                },
              }}
            >
              {columns.map((col) => (
                <TableCell key={String(col.field)} style={{ width: col.width }}>
                  {col.headerName}
                </TableCell>
              ))}
              {(onEdit || onDelete) && <TableCell align="center">Acciones</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row: T) => (
                <TableRow key={getRowId ? getRowId(row) : row.id} sx={{ backgroundColor: "white", "&:hover": { backgroundColor: "#f8fafc" } }}>
                  {columns.map((col) => (
                    <TableCell key={String(col.field)}>
                      {col.render ? col.render(row) : (row[col.field] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                        {onEdit && (
                          <Tooltip title="Editar" arrow>
                            <IconButton onClick={() => onEdit(row)} size="small" sx={{ color: "#1e293b", "&:hover": { backgroundColor: "#f1f5f9" } }}>
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="Eliminar" arrow>
                            <IconButton onClick={() => onDelete(row)} size="small" sx={{ color: "#dc2626", "&:hover": { backgroundColor: "#fef2f2" } }}>
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
                      No se encontraron resultados
                    </Typography>
                    {searchTerm && (
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        Intenta con otros términos de búsqueda
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ borderTop: "1px solid #e2e8f0", backgroundColor: "#fafafa" }}>
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
          sx={{ "& .MuiTablePagination-toolbar": { color: "#64748b" }, "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { fontSize: "0.875rem" } }}
        />
      </Box>
    </Paper>
  );
};

export default TableCustom;
