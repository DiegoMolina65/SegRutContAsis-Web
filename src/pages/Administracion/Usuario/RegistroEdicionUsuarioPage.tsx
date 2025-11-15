import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  registrarUsuario,
  obtenerUsuarioId,
  actualizarUsuario,
} from "../../../api/exportApi";
import { useRol } from "../../../hooks/exportHooks";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Container,
  Box,
  Typography,
  OutlinedInput,
  Chip,
  CardContent,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  EmailOutlined,
  PhoneOutlined,
  BadgeOutlined,
  CreditCardOutlined,
  LockOutlined,
  GroupOutlined,
  BusinessOutlined,
} from "@mui/icons-material";

import {
  ButtonCustom,
  SnackbarCustom,
  InputTextCustom,
  SelectCustom,
  CardCustom,
} from "../../../components/ui/exportComponentsUI";
import { theme } from "../../../theme/theme";
import { ThemeProvider } from "@mui/material/styles";

interface FormValues {
  nombre: string;
  email: string;
  usuarioLog: string;
  password?: string;
  telefono: string;
  nitEmpleado: string;
  carnetIdentidad: string;
  roles: string[];
}

const schema = (isEditMode: boolean): yup.ObjectSchema<FormValues> =>
  yup
    .object({
      nombre: yup.string().required("El nombre es obligatorio"),
      email: yup
        .string()
        .email("Correo inválido")
        .required("El correo es obligatorio"),
      usuarioLog: yup.string().required("El usuario es obligatorio"),
      password: isEditMode
        ? yup.string()
        : yup
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres")
            .required("La contraseña es obligatoria"),
      telefono: yup.string().required("El teléfono es obligatorio"),
      nitEmpleado: yup.string().required("El NIT es obligatorio"),
      carnetIdentidad: yup
        .string()
        .required("El carnet de identidad es obligatorio"),
      roles: yup
        .array()
        .of(yup.string().required())
        .min(1, "Debes seleccionar al menos un rol")
        .required()
        .default([]),
    })
    .required();

const RegistroEdicionUsuarioPage = () => {
  const { roles: rolesDisponibles } = useRol();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const isEditMode = !!id;

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
    resolver: yupResolver(schema(isEditMode)),
    defaultValues: {
      nombre: "",
      email: "",
      usuarioLog: "",
      password: "",
      telefono: "",
      nitEmpleado: "",
      carnetIdentidad: "",
      roles: [],
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchUsuario = async () => {
        try {
          const data = await obtenerUsuarioId(Number(id));
          reset({
            nombre: data.usrNombreCompleto ?? "",
            email: data.usrCorreo ?? "",
            usuarioLog: data.usrUsuarioLog ?? "",
            telefono: data.usrTelefono ?? "",
            nitEmpleado: data.usrNitEmpleado ?? "",
            carnetIdentidad: data.usrCarnetIdentidad ?? "",
            password: "",
            roles: data.roles ?? [],
          });
        } catch (error) {
          console.error("Error obtener usuario:", error);
        }
      };
      fetchUsuario();
    } else if (!isEditMode) {
      reset({
        nombre: "",
        email: "",
        usuarioLog: "",
        password: "",
        telefono: "",
        nitEmpleado: "",
        carnetIdentidad: "",
        roles: [],
      });
    }
  }, [isEditMode, id, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        usrNombreCompleto: data.nombre,
        usrCorreo: data.email,
        usrUsuarioLog: data.usuarioLog,
        usrContrasenaLog: data.password || "",
        usrTelefono: data.telefono,
        usrNitEmpleado: data.nitEmpleado,
        usrCarnetIdentidad: data.carnetIdentidad,
        roles: data.roles || [],
      };

      if (isEditMode) {
        await actualizarUsuario(Number(id), payload);
        setSnackbar({
          open: true,
          message: "Usuario actualizado correctamente.",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/usuarios/registrados");
        }, 2000);
      } else {
        await registrarUsuario(payload);
        setSnackbar({
          open: true,
          message: "Usuario registrado correctamente.",
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
              {isEditMode ? "Editar Usuario" : "Registro de Usuario"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: "1rem",
              }}
            >
              {isEditMode
                ? "Actualice la información del usuario."
                : "Complete la información requerida para crear una nueva cuenta en el sistema"}
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
                      Información Personal
                    </Typography>
                  </Stack>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="nombre"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="Nombre Completo"
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
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="Correo Electrónico"
                            error={!!errors.email}
                            helperText={errors.email?.message}
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

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="telefono"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="Teléfono"
                            error={!!errors.telefono}
                            helperText={errors.telefono?.message}
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
                  </Grid>
                </Box>

                <Divider sx={{ my: 4, borderColor: "#e2e8f0" }} />

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
                      <LockOutlined sx={{ fontSize: 22, color: "#475569" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "1.125rem",
                      }}
                    >
                      Credenciales de Acceso
                    </Typography>
                  </Stack>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="usuarioLog"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="Usuario"
                            error={!!errors.usuarioLog}
                            helperText={errors.usuarioLog?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BadgeOutlined
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
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            label="Contraseña"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockOutlined
                                    sx={{ color: "#94a3b8", fontSize: 20 }}
                                  />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    edge="end"
                                    size="small"
                                  >
                                    {showPassword ? (
                                      <VisibilityOff sx={{ fontSize: 20 }} />
                                    ) : (
                                      <Visibility sx={{ fontSize: 20 }} />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 4, borderColor: "#e2e8f0" }} />

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
                      <CreditCardOutlined
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
                      Documentación
                    </Typography>
                  </Stack>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="carnetIdentidad"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="Carnet de Identidad"
                            error={!!errors.carnetIdentidad}
                            helperText={errors.carnetIdentidad?.message}
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
                        name="nitEmpleado"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="NIT del Empleado"
                            error={!!errors.nitEmpleado}
                            helperText={errors.nitEmpleado?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BadgeOutlined
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

                <Divider sx={{ my: 4, borderColor: "#e2e8f0" }} />

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
                      <GroupOutlined sx={{ fontSize: 22, color: "#475569" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "1.125rem",
                      }}
                    >
                      Asignación de Roles
                    </Typography>
                  </Stack>

                  <Controller
                    name="roles"
                    control={control}
                    render={({ field }) => (
                      <SelectCustom
                        {...field}
                        label="Roles"
                        options={rolesDisponibles.map((r) => ({
                          value: r.rolNombre,
                          label: r.rolNombre,
                        }))}
                        multiple
                        value={field.value ?? []}
                        onChange={field.onChange}
                        input={<OutlinedInput label="Seleccionar Roles" />}
                        sx={{ backgroundColor: "#f8fafc" }}
                        renderValue={(selected) => (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.75,
                            }}
                          >
                            {(selected as number[]).map((id) => {
                              const rol = rolesDisponibles.find(
                                (r) => r.rolId === id
                              );
                              return (
                                <Chip
                                  key={id}
                                  label={rol?.rolNombre ?? id}
                                  size="small"
                                  sx={{
                                    backgroundColor: "#1e293b",
                                    color: "white",
                                    fontWeight: 500,
                                    fontSize: "0.813rem",
                                  }}
                                />
                              );
                            })}
                          </Box>
                        )}
                      />
                    )}
                  />
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
                    {isEditMode ? "Actualizar Usuario" : "Registrar Usuario"}
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

export default RegistroEdicionUsuarioPage;
