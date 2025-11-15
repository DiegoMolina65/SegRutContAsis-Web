import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Container,
  Box,
  Typography,
  CardContent,
  InputAdornment,
  Stack,
} from "@mui/material";
import type { AlertColor } from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  LocationOnOutlined,
  BusinessOutlined,
  ApartmentOutlined,
  MapOutlined,
} from "@mui/icons-material";

import {
  ButtonCustom,
  SnackbarCustom,
  MapCustom,
  SelectCustom,
  InputTextCustom,
  CardCustom
} from "../../../components/ui/exportComponentsUI";
import { theme } from "../../../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { useDireccionCliente } from "../../../hooks/exportHooks";
import { useCliente, useZona } from "../../../hooks/exportHooks";
import type { DireccionClienteRequestDTO } from "../../../types/exportTypes";

interface LatLng {
  lat: number;
  lng: number;
}

interface FormValues {
  clId: number | null;
  zonId?: number | null;
  nombreSucursal?: string | null;
  direccion: string;
  latitud: number;
  longitud: number;
}

const schema: yup.ObjectSchema<FormValues> = yup
  .object({
    clId: yup
      .number()
      .typeError("El cliente es obligatorio")
      .min(1, "El cliente es obligatorio")
      .required("El cliente es obligatorio"),
    zonId: yup
      .number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
    nombreSucursal: yup.string().nullable(),
    direccion: yup.string().required("La dirección es obligatoria"),
    latitud: yup.number().required("La latitud es obligatoria"),
    longitud: yup.number().required("La longitud es obligatoria"),
  })
  .required();

const DEFAULT_CENTER: LatLng = { lat: -17.7833, lng: -63.1822 };

const RegistroDireccionClientePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  const {
    crearNuevaDireccion,
    actualizarDireccionExistente,
    obtenerDireccionPorIdHook,
    loading,
  } = useDireccionCliente();
  const { clientes, obtenerClientesHook } = useCliente();
  const { zonas, obtenerZonasHook } = useZona();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      clId: null,
      zonId: null,
      nombreSucursal: "",
      direccion: "",
      latitud: 0,
      longitud: 0,
    },
  });

  const [selectedLocation, setSelectedLocation] =
    useState<LatLng>(DEFAULT_CENTER);
  const [mapKey, setMapKey] = useState(0);

  const latitud = watch("latitud");
  const longitud = watch("longitud");

  useEffect(() => {
    obtenerClientesHook();
    obtenerZonasHook();
  }, [obtenerClientesHook, obtenerZonasHook]);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchDireccion = async () => {
        try {
          const data = await obtenerDireccionPorIdHook(Number(id));
          if (data) {
            const newLocation: LatLng = {
              lat: data.dirClLatitud,
              lng: data.dirClLongitud,
            };

            reset({
              clId: data.clId,
              zonId: data.zonId ?? null,
              nombreSucursal: data.dirClNombreSucursal ?? "",
              direccion: data.dirClDireccion ?? "",
              latitud: data.dirClLatitud,
              longitud: data.dirClLongitud,
            });

            setSelectedLocation(newLocation);
            setMapKey((prev) => prev + 1); 
          }
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Error al cargar la dirección del cliente.",
            severity: "error",
          });
        }
      };
      fetchDireccion();
    } else if (!isEditMode) {
      reset({
        clId: null,
        zonId: null,
        nombreSucursal: "",
        direccion: "",
        latitud: 0,
        longitud: 0,
      });
      setSelectedLocation(DEFAULT_CENTER);
      setMapKey((prev) => prev + 1);
    }
  }, [isEditMode, id, reset, obtenerDireccionPorIdHook]);

  useEffect(() => {
    if (latitud !== 0 && longitud !== 0) {
      setSelectedLocation({ lat: latitud, lng: longitud });
    }
  }, [latitud, longitud]);

  const handleMapClick = (latLng: LatLng) => {
    setValue("latitud", latLng.lat);
    setValue("longitud", latLng.lng);
    setSelectedLocation(latLng);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const payload: DireccionClienteRequestDTO = {
        clId: Number(data.clId) || 0,
        zonId: data.zonId ? Number(data.zonId) : undefined,
        dirClNombreSucursal: data.nombreSucursal || null,
        dirClDireccion: data.direccion,
        dirClLatitud: data.latitud,
        dirClLongitud: data.longitud,
      };

      if (isEditMode && id) {
        await actualizarDireccionExistente(Number(id), payload);
        setSnackbar({
          open: true,
          message: "Dirección de cliente actualizada correctamente.",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/direccioncliente/gestiondireccionclientesregistradas");
        }, 2000);
      } else {
        await crearNuevaDireccion(payload);
        setSnackbar({
          open: true,
          message: "Dirección de cliente registrada correctamente.",
          severity: "success",
        });
        reset();
        setSelectedLocation(DEFAULT_CENTER);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error en ${
          isEditMode ? "la actualización" : "el registro"
        }. Inténtalo nuevamente.`,
        severity: "error",
      });
    }
  };

  const hasValidLocation = latitud !== 0 && longitud !== 0;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ minHeight: "100vh", backgroundColor: "#ffffff", py: 6, px: 2 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 2,
                backgroundColor: "#1e293b",
                mb: 2,
              }}
            >
              <BusinessOutlined sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: "#1e293b",
                fontWeight: 700,
                mb: 1,
                letterSpacing: "-0.5px",
              }}
            >
              {isEditMode
                ? "Editar Dirección de Cliente"
                : "Registrar Dirección de Cliente"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", fontSize: "1rem" }}
            >
              {isEditMode
                ? "Actualice la información de la dirección del cliente."
                : "Complete la información requerida para registrar una nueva dirección de cliente en el sistema"}
            </Typography>
          </Box>

          <CardCustom
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              backgroundColor: "white",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Box sx={{ mb: 4 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        backgroundColor: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LocationOnOutlined
                        sx={{ fontSize: 22, color: "#475569" }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "1.125rem",
                      }}
                    >
                      Detalles de la Dirección
                    </Typography>
                  </Stack>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="clId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            {...field}
                            label="Cliente"
                            error={!!errors.clId}
                            helperText={errors.clId?.message}
                            options={clientes.map((c) => ({
                              value: c.clId,
                              label: c.clNombreCompleto,
                            }))}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="zonId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            {...field}
                            label="Zona (Opcional)"
                            error={!!errors.zonId}
                            helperText={errors.zonId?.message}
                            options={zonas.map((z) => ({
                              value: z.zonId,
                              label: z.zonNombre,
                            }))}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Controller
                        name="nombreSucursal"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            label="Nombre de Sucursal (Opcional)"
                            value={field.value ?? ""}
                            error={!!errors.nombreSucursal}
                            helperText={errors.nombreSucursal?.message}
                            sx={{ backgroundColor: "#f8fafc" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <ApartmentOutlined
                                    sx={{ color: "#94a3b8", fontSize: 20 }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Controller
                        name="direccion"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            label="Dirección"
                            multiline
                            rows={2}
                            error={!!errors.direccion}
                            helperText={errors.direccion?.message}
                            sx={{
                              backgroundColor: "#f8fafc",
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationOnOutlined
                                    sx={{ color: "#94a3b8", fontSize: 20 }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="latitud"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            label="Latitud"
                            type="number"
                            value={field.value || 0}
                            error={!!errors.latitud}
                            helperText={errors.latitud?.message}
                            sx={{ backgroundColor: "#f8fafc" }}
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MapOutlined
                                    sx={{ color: "#94a3b8", fontSize: 20 }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="longitud"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            label="Longitud"
                            type="number"
                            value={field.value || 0}
                            error={!!errors.longitud}
                            helperText={errors.longitud?.message}
                            sx={{ backgroundColor: "#f8fafc" }}
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MapOutlined
                                    sx={{ color: "#94a3b8", fontSize: 20 }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={12}>
                      <MapCustom
                        key={mapKey}
                        center={selectedLocation}
                        zoom={hasValidLocation ? 15 : 12}
                        onMapClick={handleMapClick}
                        markers={
                          hasValidLocation
                            ? [{ position: selectedLocation, type: "default" }]
                            : []
                        }
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
                  <ButtonCustom
                    fullWidth
                    variant="contained"
                    sx={{
                      py: 1.5,
                      fontSize: "0.938rem",
                      fontWeight: 600,
                      textTransform: "none",
                      backgroundColor: "#1e293b",
                      "&:hover": { backgroundColor: "#0f172a" },
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                    loading={loading}
                    type="submit"
                  >
                    {isEditMode
                      ? "Actualizar Dirección"
                      : "Registrar Dirección"}
                  </ButtonCustom>
                </Box>
              </Box>
            </CardContent>
          </CardCustom>
        </Container>

        <SnackbarCustom
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </ThemeProvider>
  );
};

export default RegistroDireccionClientePage;
