import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  LocationOnOutlined,
  MapOutlined,
  PersonPinCircleOutlined,
  StorefrontOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  SelectCustom,
  TableCustom,
  MapCustom,
  SnackbarCustom,
} from "../../../components/ui/exportComponentsUI";
import type { Column } from "../../../components/ui/TableCustom";
import type {
  MarkerData,
  InfoWindowData,
} from "../../../components/ui/MapaGoogle/MapCustom";

import { useVisita } from "../../../hooks/exportHooks";
import { useMarcarLlegadaVisita } from "../../../hooks/MarcarLlegadaVisita/useMarcarLlegadaVisita";
import type { MarcarLlegadaVisitaResponseDTO } from "../../../types/exportTypes";

const VerMarcacionesPorVisitaPage = () => {
  const [selectedVisitaId, setSelectedVisitaId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"all" | "client" | "vendor">(
    "all"
  );

  const { visitas: allVisitas, obtenerTodasVisitasHook } = useVisita();
  const {
    marcaciones,
    obtenerMarcacionesPorVisitaHook,
    error: marcacionesError,
  } = useMarcarLlegadaVisita();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "info" });

  useEffect(() => {
    obtenerTodasVisitasHook();
  }, [obtenerTodasVisitasHook]);

  useEffect(() => {
    if (selectedVisitaId) {
      obtenerMarcacionesPorVisitaHook(selectedVisitaId);
    }
  }, [selectedVisitaId, obtenerMarcacionesPorVisitaHook]);

  useEffect(() => {
    if (marcacionesError) {
      setSnackbar({ open: true, message: marcacionesError, severity: "error" });
    }
  }, [marcacionesError]);

  const columns: Column<MarcarLlegadaVisitaResponseDTO>[] = [
    { field: "mlvId", headerName: "MARCACIÓN ID", width: 80 },
    { field: "nombreVendedor", headerName: "NOMBRE VENDEDOR", width: 250 },
    { field: "nombreCliente", headerName: "NOMBRE CLIENTE", width: 250 },
    { field: "nombreSucursalCliente", headerName: "NOMBRE SUCURSAL", width: 250 },
    { field: "mlvHora", headerName: "HORA MARCACIÓN", width: 120 },
    { field: "mlvLatitud", headerName: "LATITUD MARCACIÓN", width: 120 },
    { field: "mlvLongitud", headerName: "LONGITUD MARCACIÓN", width: 120 },
    { field: "mlvFechaCreacion", headerName: "FECHA CREACIÓN", width: 120 },
  ];

  const mapMarkers = useMemo(() => {
    const newMarkers: MarkerData[] = [];

    marcaciones.forEach((marcacion) => {
      if (
        marcacion.sucursalLatitud &&
        marcacion.sucursalLongitud &&
        (filterType === "all" || filterType === "client")
      ) {
        const info: InfoWindowData = {
          title: "Ubicación del Cliente",
          content: {
            nombreCliente: marcacion.nombreCliente,
            nombreSucursal: marcacion.nombreSucursalCliente,
            nombreZona: "No visible",
            direccion: "No visible",
            latitud: marcacion.sucursalLatitud,
            longitud: marcacion.sucursalLongitud,
          },
        };
        newMarkers.push({
          position: {
            lat: marcacion.sucursalLatitud,
            lng: marcacion.sucursalLongitud,
          },
          type: "client",
          title: marcacion.nombreSucursalCliente,
          id: `client-${marcacion.mlvId}`,
          info,
        });
      }

      if (
        marcacion.mlvLatitud &&
        marcacion.mlvLongitud &&
        (filterType === "all" || filterType === "vendor")
      ) {
        const info: InfoWindowData = {
          title: "Ubicación del Vendedor",
          content: {
            nombreVendedor: marcacion.nombreVendedor,
            telefonoVendedor: marcacion.telefonoVendedor,
            usuarioLog: marcacion.usuarioLogVendedor,
            latitud: marcacion.sucursalLatitud,
            longitud: marcacion.sucursalLongitud,
          },
        };
        newMarkers.push({
          position: { lat: marcacion.mlvLatitud, lng: marcacion.mlvLongitud },
          type: "vendor",
          title: marcacion.nombreVendedor || "Vendedor",
          id: `vendor-${marcacion.mlvId}`,
          info,
        });
      }
    });
    return newMarkers;
  }, [marcaciones, filterType]);

  const selectedVisitaData = allVisitas.find(
    (v) => v.visId === selectedVisitaId
  );

  const clientMarkers = mapMarkers.filter((m) => m.type === "client").length;
  const vendorMarkers = mapMarkers.filter((m) => m.type === "vendor").length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
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
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#1e293b",
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "2rem" },
                letterSpacing: "-0.5px",
              }}
            >
              Marcaciones por Visita
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mt: 0.5,
              }}
            >
              Visualice las ubicaciones registradas durante las visitas
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                backgroundColor: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VisibilityOutlined sx={{ fontSize: 18, color: "#475569" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#1e293b",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Seleccionar Visita
            </Typography>
          </Stack>

          <SelectCustom
            label="Visita"
            value={selectedVisitaId ?? ""}
            onChange={(value) => {
              setSelectedVisitaId(value === "" ? null : Number(value));
            }}
            options={allVisitas.map((visita) => ({
              value: visita.visId,
              label: `${visita.nombreVendedor} - ${visita.nombreCliente} - ${visita.nombreSucursalCliente} `,
            }))}
            sx={{ mb: 0 }}
          />

          {selectedVisitaData && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#f8fafc",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocationOnOutlined
                    sx={{
                      color: "white",
                      fontSize: "1.25rem",
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: "#1e293b",
                      fontWeight: 600,
                      fontSize: "0.938rem",
                    }}
                  >
                    {selectedVisitaData.nombreCliente} -{" "}
                    {selectedVisitaData.nombreSucursalCliente}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "0.813rem",
                    }}
                  >
                    Visita seleccionada
                  </Typography>
                </Box>
                <Chip
                  label={`${marcaciones.length} ${
                    marcaciones.length === 1 ? "marcación" : "marcaciones"
                  }`}
                  size="small"
                  sx={{
                    backgroundColor: "#1e293b",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.813rem",
                  }}
                />
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {selectedVisitaId && marcaciones.length > 0 && (
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid #e2e8f0",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    backgroundColor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MapOutlined sx={{ fontSize: 18, color: "#475569" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1e293b",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  Filtro de Visualización
                </Typography>
              </Stack>

              <ToggleButtonGroup
                value={filterType}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    setFilterType(newValue);
                  }
                }}
                size="small"
                sx={{
                  "& .MuiToggleButton-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.813rem",
                    px: 2,
                    py: 0.75,
                    border: "1px solid #e2e8f0",
                    color: "#64748b",
                    "&.Mui-selected": {
                      backgroundColor: "#1e293b",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#0f172a",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                  },
                }}
              >
                <ToggleButton value="all">
                  Todos ({mapMarkers.length})
                </ToggleButton>
                <ToggleButton value="client">
                  <StorefrontOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                  Clientes ({clientMarkers})
                </ToggleButton>
                <ToggleButton value="vendor">
                  <PersonPinCircleOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                  Vendedores ({vendorMarkers})
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      {selectedVisitaId && marcaciones.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocationOnOutlined sx={{ fontSize: 20, color: "#3b82f6" }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mb: 0.5, fontSize: "0.813rem" }}
                  >
                    Total Marcaciones
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#1e293b",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                    }}
                  >
                    {marcaciones.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <StorefrontOutlined sx={{ fontSize: 20, color: "#16a34a" }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mb: 0.5, fontSize: "0.813rem" }}
                  >
                    Marcadores Cliente
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#1e293b",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                    }}
                  >
                    {clientMarkers}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: "#fef3c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonPinCircleOutlined
                    sx={{ fontSize: 20, color: "#f59e0b" }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mb: 0.5, fontSize: "0.813rem" }}
                  >
                    Marcadores Vendedor
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#1e293b",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                    }}
                  >
                    {vendorMarkers}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Mapa */}
      {selectedVisitaId && marcaciones.length > 0 ? (
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ height: 500 }}>
            <MapCustom markers={mapMarkers} />
          </Box>
        </Card>
      ) : selectedVisitaId ? (
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid #e2e8f0",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LocationOnOutlined sx={{ fontSize: 40, color: "#94a3b8" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1e293b",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Sin Marcaciones
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    maxWidth: 400,
                    mx: "auto",
                  }}
                >
                  No se encontraron marcaciones para esta visita
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ) : null}

      {/* Tabla */}
      {selectedVisitaId && marcaciones.length > 0 && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <TableCustom
              columns={columns}
              rows={marcaciones.map((m) => ({
                ...m,
                id: m.mlvId,
              }))}
              title="Detalle de Marcaciones"
            />
          </CardContent>
        </Card>
      )}

      {!selectedVisitaId && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MapOutlined sx={{ fontSize: 40, color: "#94a3b8" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1e293b",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Seleccione una Visita
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    maxWidth: 400,
                    mx: "auto",
                  }}
                >
                  Para visualizar las marcaciones en el mapa, seleccione una
                  visita del menú desplegable superior
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <SnackbarCustom
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default VerMarcacionesPorVisitaPage;
