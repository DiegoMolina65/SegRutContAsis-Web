import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CardContent,
  Stack,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  SearchOutlined,
  AddCircleOutline,
  AssignmentIndOutlined,
} from "@mui/icons-material";
import type { AsignacionClienteVendedorResponseDTO } from "../../../types/exportTypes";

import type { Column } from "../../../components/ui/TableCustom";
import { useAsignacionClienteVendedor } from "../../../hooks/exportHooks";
import {
  SnackbarCustom,
  TableCustom,
  CardCustom,
  ButtonCustom,
} from "../../../components/ui/exportComponentsUI";

type AsignacionTableDTO = AsignacionClienteVendedorResponseDTO & { id: number };

const AsignacionClientesVendedorRegistradasPage: React.FC = () => {
  const { asignaciones, obtenerTodasAsignacionesHook, desactivarAsignacionHook } =
    useAsignacionClienteVendedor();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    obtenerTodasAsignacionesHook();
  }, [obtenerTodasAsignacionesHook]);

  const handleDisable = async (row: AsignacionTableDTO) => {
    try {
      await desactivarAsignacionHook(row.id);
      setSnackbar({
        open: true,
        message: "Asignación deshabilitada correctamente.",
        severity: "success",
      });
      obtenerTodasAsignacionesHook();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al deshabilitar la asignación.",
        severity: "error",
      });
    }
  };

  const handleEdit = (row: AsignacionTableDTO) => {
    navigate(`/asignacionclientevendedor/registro?id=${row.id}`);
  };

  const handleNewAsignacion = () => {
    navigate("/asignacionclientevendedor/registro");
  };

  const columns: Column<AsignacionTableDTO>[] = [
    { field: "asgId", headerName: "ID", width: 80 },
    { field: "supervisorNombre", headerName: "Supervisor", width: 200 },
    { field: "vendedorNombre", headerName: "Vendedor", width: 200 },
    { field: "clienteNombre", headerName: "Cliente", width: 200 },
    { field: "asgFechaCreacion", headerName: "Fecha Creación", width: 200 },
  ];

  const filteredAsignaciones = asignaciones.filter(
    (asignacion) =>
      asignacion.supervisorNombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      asignacion.vendedorNombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      asignacion.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{ minHeight: "100vh", backgroundColor: "#ffffff", p: { xs: 2, sm: 3, md: 4 } }}
    >
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AssignmentIndOutlined sx={{ fontSize: 24, color: "#475569" }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: "#1e293b",
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  letterSpacing: "-0.5px",
                }}
              >
                Asignaciones Registradas
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                Gestión y administración de asignaciones en el sistema
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2.5,
              py: 1,
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontSize: "0.875rem" }}
            >
              Total de asignaciones:
            </Typography>
            <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 700 }}>
              {asignaciones.length}
            </Typography>
          </Box>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            placeholder="Buscar por supervisor, vendedor o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { backgroundColor: "#f8fafc" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ color: "#94a3b8", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <ButtonCustom
            variant="contained"
            startIcon={<AddCircleOutline />}
            onClick={handleNewAsignacion}
            sx={{
              backgroundColor: "#1e293b",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.25,
              "&:hover": { backgroundColor: "#0f172a" },
              whiteSpace: "nowrap",
            }}
          >
            Nueva Asignación
          </ButtonCustom>
        </Stack>
      </Box>

      <CardCustom
        elevation={0}
        sx={{ border: "1px solid #e2e8f0", borderRadius: 2, overflow: "hidden" }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableCustom<AsignacionTableDTO>
            columns={columns}
            rows={filteredAsignaciones.map(a => ({ ...a, id: a.asgId }))}
            title="Lista de Asignaciones"
            onEdit={handleEdit}
            onDelete={handleDisable}
            getRowId={(row) => row.id}
          />
        </CardContent>
      </CardCustom>

      <SnackbarCustom
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default AsignacionClientesVendedorRegistradasPage;
