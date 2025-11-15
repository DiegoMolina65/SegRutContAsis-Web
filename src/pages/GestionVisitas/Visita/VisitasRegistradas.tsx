import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CardContent, Stack, InputAdornment, TextField } from "@mui/material";
import { SearchOutlined, AddCircleOutline, CategoryOutlined } from "@mui/icons-material";
import type { VisitaResponseDTO } from "../../../types/exportTypes";

import type { Column } from "../../../components/ui/TableCustom";
import { useVisita } from "../../../hooks/exportHooks";
import { SnackbarCustom, TableCustom, CardCustom, ButtonCustom } from "../../../components/ui/exportComponentsUI";

type VisitaTableDTO = VisitaResponseDTO & { id: number };

const VisitasRutaClienteRegistrados: React.FC = () => {
  const { visitas, obtenerTodasVisitasHook, deshabilitarVisitaId } = useVisita();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" | "info" }>({ open: false, message: "", severity: "info" });

  useEffect(() => {
    obtenerTodasVisitasHook();
  }, [obtenerTodasVisitasHook]);

  const handleDisable = async (row: VisitaTableDTO) => {
    try {
      await deshabilitarVisitaId(row.id);
      setSnackbar({ open: true, message: "Visita deshabilitada correctamente.", severity: "success" });
      obtenerTodasVisitasHook();
    } catch (error) {
      setSnackbar({ open: true, message: "Error al deshabilitar la visita.", severity: "error" });
    }
  };

  const handleEdit = (row: VisitaTableDTO) => {
    navigate(`/visitas/registro?id=${row.id}`);
  };

  const handleNewVisita = () => {
    navigate("/visitas/registro");
  };

  const columns: Column<VisitaTableDTO>[] = [
    { field: "visId", headerName: "VISITA ID", width: 80 },
    { field: "nombreVendedor", headerName: "NOMBRE VENDEDOR", width: 200 },
    { field: "nombreCliente", headerName: "NOMBRE CLIENTE", width: 200 },
    { field: "nombreRuta", headerName: "NOMBRE RUTA", width: 200 },
    { field: "fechaEjecucionRuta", headerName: "EJECUCIÓN RUTA", width: 200 },
    { field: "nombreSucursalCliente", headerName: "NOMBRE SUCUSAL", width: 200 },
    { field: "nombreZona", headerName: "NOMBRE ZONA", width: 200 },
    { field: "visComentario", headerName: "COMENTARIO", width: 300 },
  ];

  const filteredVisitas = visitas.filter(
    (visita) =>
      visita.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visita.nombreSucursalCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visita.visComentario?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#ffffff", p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CategoryOutlined sx={{ fontSize: 24, color: "#475569" }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: "#1e293b", fontWeight: 700, fontSize: { xs: "1.5rem", sm: "2rem" }, letterSpacing: "-0.5px" }}>
                Visitas Registradas
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>Gestión y administración de visitas en el sistema</Typography>
            </Box>
          </Stack>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2.5, py: 1, backgroundColor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.875rem" }}>Total de visitas:</Typography>
            <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 700 }}>{visitas.length}</Typography>
          </Box>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            placeholder="Buscar por cliente, sucursal o comentario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { backgroundColor: "#f8fafc" } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: "#94a3b8", fontSize: 20 }} /></InputAdornment>,
            }}
          />
          <ButtonCustom
            variant="contained"
            startIcon={<AddCircleOutline />}
            onClick={handleNewVisita}
            sx={{ backgroundColor: "#1e293b", color: "white", textTransform: "none", fontWeight: 600, px: 3, py: 1.25, "&:hover": { backgroundColor: "#0f172a" }, whiteSpace: "nowrap" }}
          >
            Nueva Visita
          </ButtonCustom>
        </Stack>
      </Box>

      <CardCustom elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          <TableCustom<VisitaTableDTO>
            columns={columns}
            rows={filteredVisitas.map((v) => ({ ...v, id: v.visId }))}
            title="Lista de Visitas"
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

export default VisitasRutaClienteRegistrados;
