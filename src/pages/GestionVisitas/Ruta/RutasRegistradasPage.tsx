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
  RouteOutlined,
} from "@mui/icons-material";
import type { RutaResponseDTO } from "../../../types/exportTypes";

import type { Column } from "../../../components/ui/TableCustom";
import { useRuta } from "../../../hooks/exportHooks";
import {
  SnackbarCustom,
  TableCustom,
  CardCustom,
  ButtonCustom,
} from "../../../components/ui/exportComponentsUI";

type RutaTableDTO = RutaResponseDTO & { id: number };

const RutasRegistradasPage: React.FC = () => {
  const { rutas, obtenerRutasHook, desactivarRutaExistente } = useRuta();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "info" });

  useEffect(() => {
    obtenerRutasHook();
  }, [obtenerRutasHook]);

  const handleDisable = async (row: RutaTableDTO) => {
    try {
      await desactivarRutaExistente(row.id);
      setSnackbar({
        open: true,
        message: "Ruta deshabilitada correctamente.",
        severity: "success",
      });
      obtenerRutasHook();
    } catch {
      setSnackbar({
        open: true,
        message: "Error al deshabilitar la ruta.",
        severity: "error",
      });
    }
  };

  const handleEdit = (row: RutaTableDTO) => {
    navigate(`/ruta/registro?id=${row.id}`);
  };

  const handleNewRuta = () => {
    navigate("/ruta/registro");
  };

  const columns: Column<RutaTableDTO>[] = [
    { field: "rutId", headerName: "RUTA ID", width: 80 },
    { field: "rutNombre", headerName: "NOMBRE RUTA", width: 200 },
    { field: "rutComentario", headerName: "COMENTARIO", width: 300 },
    {
      field: "rutFechaEjecucion",
      headerName: "FECHA EJECUÍON",
      width: 150,
    },
    { field: "nombreVendedor", headerName: "NOMBRE VENDEDOR", width: 120 },
    { field: "nombreSupervisor", headerName: "NOMBRE SUPERVISOR", width: 120 },
  ];

  const mappedRutas: RutaTableDTO[] = rutas.map((r) => ({ ...r, id: r.rutId }));

  const filteredRutas = mappedRutas.filter(
    (ruta) =>
      ruta.rutNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ruta.rutComentario &&
        ruta.rutComentario.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ mb: 3 }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ flex: 1 }}
          >
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
              <RouteOutlined sx={{ fontSize: 24, color: "#475569" }} />
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
                Rutas Registradas
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                Gestión y administración de rutas en el sistema
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
              Total de rutas:
            </Typography>
            <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 700 }}>
              {rutas.length}
            </Typography>
          </Box>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            placeholder="Buscar por nombre o comentario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": { backgroundColor: "#f8fafc" },
            }}
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
            onClick={handleNewRuta}
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
            Nueva Ruta
          </ButtonCustom>
        </Stack>
      </Box>

      <CardCustom
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableCustom<RutaTableDTO>
            columns={columns}
            rows={filteredRutas}
            title="Lista de Rutas"
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

export default RutasRegistradasPage;
