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
  Card,
  CardContent,
  InputAdornment,
  Stack,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  PersonOutline,
  CreditCardOutlined,
  PhoneOutlined,
  EmailOutlined,
  BusinessOutlined,
} from "@mui/icons-material";

import {
  ButtonCustom,
  SnackbarCustom,
  InputTextCustom,
} from "../../../components/ui/exportComponentsUI";
import { theme } from "../../../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { useCliente } from "../../../hooks/exportHooks";
import type { ClienteRequestDTO } from "../../../types/exportTypes";

interface FormValues {
  clNombreCompleto: string;
  clCarnetIdentidad: string;
  clNitCliente: string;
  clTipoCliente?: string | null;
  clTelefono: string;
}

const schema: yup.ObjectSchema<FormValues> = yup
  .object({
    clNombreCompleto: yup.string().required("El nombre completo es obligatorio"),
    clCarnetIdentidad: yup
      .string()
      .required("El carnet de identidad es obligatorio"),
    clNitCliente: yup.string().required("El NIT del cliente es obligatorio"),
    clTipoCliente: yup.string().nullable(),
    clTelefono: yup.string().required("El teléfono es obligatorio"),
  })
  .required();

const RegistroEdicionClientePage = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  const {
    crearNuevoCliente,
    actualizarClienteExistente,
    obtenerClientePorIdHook,
  } = useCliente();

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
      clNombreCompleto: "",
      clCarnetIdentidad: "",
      clNitCliente: "",
      clTipoCliente: null,
      clTelefono: "",
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchCliente = async () => {
        try {
          const data = await obtenerClientePorIdHook(Number(id));
          if (data) {
            reset({
              clNombreCompleto: data.clNombreCompleto ?? "",
              clCarnetIdentidad: data.clCarnetIdentidad ?? "",
              clNitCliente: data.clNitCliente ?? "",
              clTipoCliente: data.clTipoCliente ?? null,
              clTelefono: data.clTelefono ?? "",
            });
          }
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Error al cargar el cliente.",
            severity: "error",
          });
        }
      };
      fetchCliente();
    } else if (!isEditMode) {
      reset({
        clNombreCompleto: "",
        clCarnetIdentidad: "",
        clNitCliente: "",
        clTipoCliente: null,
        clTelefono: "",
      });
    }
  }, [isEditMode, id, reset, obtenerClientePorIdHook]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const payload: ClienteRequestDTO = {
        clNombreCompleto: data.clNombreCompleto,
        clCarnetIdentidad: data.clCarnetIdentidad,
        clNitCliente: data.clNitCliente,
        clTipoCliente: data.clTipoCliente,
        clTelefono: data.clTelefono,
      };

      if (isEditMode && id) {
        await actualizarClienteExistente(Number(id), payload);
        setSnackbar({
          open: true,
          message: "Cliente actualizado correctamente.",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/cliente/registrados");
        }, 2000);
      } else {
        await crearNuevoCliente(payload);
        setSnackbar({
          open: true,
          message: "Cliente registrado correctamente.",
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
              {isEditMode ? "Editar Cliente" : "Registro de Cliente"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: "1rem",
              }}
            >
              {isEditMode
                ? "Actualice la información del cliente."
                : "Complete la información requerida para crear un nuevo cliente en el sistema"}
            </Typography>
          </Box>

          <Card
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
                      <PersonOutline sx={{ fontSize: 22, color: "#475569" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "1.125rem",
                      }}
                    >
                      Información del Cliente
                    </Typography>
                  </Stack>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 12 }}>
                      <Controller
                        name="clNombreCompleto"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="Nombre Completo"
                            error={!!errors.clNombreCompleto}
                            helperText={errors.clNombreCompleto?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonOutline
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
                        name="clCarnetIdentidad"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="Carnet de Identidad"
                            error={!!errors.clCarnetIdentidad}
                            helperText={errors.clCarnetIdentidad?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CreditCardOutlined
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
                        name="clNitCliente"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="NIT del Cliente"
                            error={!!errors.clNitCliente}
                            helperText={errors.clNitCliente?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CreditCardOutlined
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
                        name="clTelefono"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="Teléfono"
                            error={!!errors.clTelefono}
                            helperText={errors.clTelefono?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneOutlined
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
                        name="clTipoCliente"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="Tipo de Cliente (Opcional)"
                            error={!!errors.clTipoCliente}
                            helperText={errors.clTipoCliente?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailOutlined
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
                    {isEditMode ? "Actualizar Cliente" : "Registrar Cliente"}
                  </ButtonCustom>
                </Box>
              </Box>
            </CardContent>
          </Card>
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

export default RegistroEdicionClientePage;
