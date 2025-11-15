import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CardContent,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  SearchOutlined,
  AddCircleOutline,
  LocationOnOutlined,
} from "@mui/icons-material";
import type { DireccionClienteResponseDTO } from "../../../types/exportTypes";
import type { Column } from "../../../components/ui/TableCustom";
import { useDireccionCliente } from "../../../hooks/exportHooks";
import { SnackbarCustom, InputTextCustom, TableCustom, ButtonCustom, CardCustom, MapCustom} from "../../../components/ui/exportComponentsUI";
import type { MarkerData } from "../../../components/ui/MapaGoogle/MapCustom";

type DireccionClienteTableDTO = DireccionClienteResponseDTO & { id: number };

const DireccionesClientesRegistradasPage: React.FC = () => {
  const { direcciones, obtenerTodasDireccionesHook, desactivarDireccionPorId } =
    useDireccionCliente();
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
    obtenerTodasDireccionesHook();
  }, [obtenerTodasDireccionesHook]);

  const [markers, setMarkers] = useState<MarkerData[]>([]);

useEffect(() => {
  if (direcciones.length > 0) {
    const newMarkers: MarkerData[] = direcciones
      .filter((d) => d.dirClLatitud != null && d.dirClLongitud != null)
      .map((d) => ({
        position: { lat: d.dirClLatitud, lng: d.dirClLongitud },
        type: "client" as const,
        title: d.dirClNombreSucursal ?? "Sin nombre",
        id: d.dirClId,
        info: {
          title: d.nombreCliente ?? "Cliente sin nombre",
          content: {
            direccion: d.dirClDireccion ?? "Sin dirección",
            nombreCliente: d.nombreCliente ?? "Desconocido",
            nombreSucursal: d.dirClNombreSucursal ?? "Sin sucursal",
            nombreZona: d.nombreZona ?? "Sin zona",
            latitud: d.dirClLatitud ?? 0,
            longitud: d.dirClLongitud ?? 0,
          },
        },
      }));
    setMarkers(newMarkers);
  }
}, [direcciones]);


  const handleDisable = async (row: DireccionClienteTableDTO) => {
    try {
      await desactivarDireccionPorId(row.id);
      setSnackbar({
        open: true,
        message: "Dirección deshabilitada correctamente.",
        severity: "success",
      });
      obtenerTodasDireccionesHook();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al deshabilitar la dirección.",
        severity: "error",
      });
    }
  };

  const handleEdit = (row: DireccionClienteTableDTO) => {
    navigate(`/direccioncliente/gestiondireccionclientes?id=${row.id}`);
  };

  const handleNewDireccion = () => {
    navigate("/direccioncliente/gestiondireccionclientes");
  };

  const columns: Column<DireccionClienteTableDTO>[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "nombreCliente", headerName: "Cliente", width: 180 },
    { field: "dirClNombreSucursal", headerName: "Sucursal", width: 150 },
    { field: "dirClDireccion", headerName: "Dirección", width: 250 },
    { field: "nombreZona", headerName: "Zona", width: 120 },
    { field: "dirClLatitud", headerName: "Latitud", width: 100 },
    { field: "dirClLongitud", headerName: "Longitud", width: 100 },
  ];

  const mappedDirecciones: DireccionClienteTableDTO[] = direcciones.map(
    (d) => ({ ...d, id: d.dirClId })
  );

  const filteredDirecciones = mappedDirecciones.filter(
    (direccion) =>
      direccion.dirClDireccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      direccion.nombreCliente
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      direccion.dirClNombreSucursal
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      direccion.nombreZona?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <LocationOnOutlined sx={{ fontSize: 24, color: "#475569" }} />
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
                Direcciones de Clientes Registradas
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                Gestión y administración de direcciones de clientes en el
                sistema
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
              Total de direcciones:
            </Typography>
            <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 700 }}>
              {direcciones.length}
            </Typography>
          </Box>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <InputTextCustom
            placeholder="Buscar por dirección, cliente, sucursal o zona..."
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
            onClick={handleNewDireccion}
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
            Nueva Dirección
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
          <TableCustom<DireccionClienteTableDTO>
            columns={columns}
            rows={filteredDirecciones}
            title="Lista de Direcciones de Clientes"
            searchField="dirClDireccion"
            onEdit={handleEdit}
            onDelete={handleDisable}
            getRowId={(row) => row.id}
          />
        </CardContent>
      </CardCustom>

      <CardCustom
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          overflow: "hidden",
          mt: 4,
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ubicación de Clientes
          </Typography>
          <MapCustom markers={markers} />
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

export default DireccionesClientesRegistradasPage;
