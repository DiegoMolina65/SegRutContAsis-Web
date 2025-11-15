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
  TextField,
  CardContent,
  InputAdornment,
  Stack,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  CategoryOutlined,
  DescriptionOutlined,
  BusinessOutlined,
} from "@mui/icons-material";

import {
  ButtonCustom,
  SnackbarCustom,
  CardCustom,
} from "../../../components/ui/exportComponentsUI";
import { theme } from "../../../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { useZona } from "../../../hooks/exportHooks";
import type { ZonaRequestDTO } from "../../../types/exportTypes";

interface FormValues {
  nombre: string;
  descripcion: string;
}

const schema: yup.ObjectSchema<FormValues> = yup
  .object({
    nombre: yup.string().required("El nombre de la zona es obligatorio"),
    descripcion: yup.string().required("La descripción es obligatoria"),
  })
  .required();

const RegistroEdicionZonaPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  const { crearNuevaZona, actualizarZonaId, obtenerZonaPorIdHook } = useZona();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
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
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchZona = async () => {
        try {
          const data = await obtenerZonaPorIdHook(Number(id));
          if (data) {
            reset({
              nombre: data.zonNombre ?? "",
              descripcion: data.zonDescripcion ?? "",
            });
          }
        } catch (error) {
          console.error("Error al obtener zona:", error);
          setSnackbar({
            open: true,
            message: "Error al cargar la zona.",
            severity: "error",
          });
        }
      };
      fetchZona();
    } else if (!isEditMode) {
      reset({
        nombre: "",
        descripcion: "",
      });
    }
  }, [isEditMode, id, reset, obtenerZonaPorIdHook]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const payload: ZonaRequestDTO = {
        nombre: data.nombre,
        descripcion: data.descripcion,
      };

      if (isEditMode && id) {
        await actualizarZonaId(Number(id), payload);
        setSnackbar({
          open: true,
          message: "Zona actualizada correctamente.",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/zona/registrados");
        }, 2000);
      } else {
        await crearNuevaZona(payload);
        setSnackbar({
          open: true,
          message: "Zona registrada correctamente.",
          severity: "success",
        });
        reset();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error en ${
          isEditMode ? "la actualización" : "el registro"
        }. Inténtalo nuevamente.`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          py: 6,
          px: 2,
          alignContent: "center",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              mb: 4,
              textAlign: "center",
            }}
          >
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
              {isEditMode ? "Editar Zona" : "Registro de Zona"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: "1rem",
              }}
            >
              {isEditMode
                ? "Actualice la información de la zona."
                : "Complete la información requerida para crear una nueva zona en el sistema"}
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
                      <CategoryOutlined
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
                      Información de la Zona
                    </Typography>
                  </Stack>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 12 }}>
                      <Controller
                        name="nombre"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Nombre de la Zona"
                            error={!!errors.nombre}
                            helperText={errors.nombre?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CategoryOutlined
                                    sx={{ color: "#94a3b8", fontSize: 20 }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>
                      <Controller
                        name="descripcion"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Descripción"
                            multiline
                            rows={4}
                            error={!!errors.descripcion}
                            helperText={errors.descripcion?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <DescriptionOutlined
                                    sx={{ color: "#94a3b8", fontSize: 20 }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
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
                      "&:hover": {
                        backgroundColor: "#0f172a",
                      },
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                    loading={loading}
                    type="submit"
                  >
                    {isEditMode ? "Actualizar Zona" : "Registrar Zona"}
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

export default RegistroEdicionZonaPage;
