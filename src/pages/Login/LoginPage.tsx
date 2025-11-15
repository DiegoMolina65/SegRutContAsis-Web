import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../hooks/exportHooks";
import { loginUsuario } from "../../api/exportApi";
import {
  Container,
  Box,
  Typography,
  CardContent,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
} from "@mui/icons-material";
import {
  ButtonCustom,
  SnackbarCustom,
  InputTextCustom,
  CardCustom,
} from "../../components/ui/exportComponentsUI";
import { theme } from "../../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import LogoEmpresa from "../../assets/logo-empresa.png";

import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormValues = {
  usuarioLog: string;
  contrasenaLog: string;
};

const schema = yup
  .object({
    usuarioLog: yup.string().required("El usuario es obligatorio"),
    contrasenaLog: yup
      .string()
      .min(6, "Mínimo 6 caracteres")
      .required("La contraseña es obligatoria"),
  })
  .required();

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useUsuario();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "info" });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { usuarioLog: "", contrasenaLog: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const response = await loginUsuario({
        UsuarioLog: data.usuarioLog,
        ContrasenaLog: data.contrasenaLog,
      });

      login(response);

      setSnackbar({
        open: true,
        message: "Inicio de sesión exitoso",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || "Error al iniciar sesión",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <CardCustom
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                pt: 6,
                pb: 4,
                px: 4,
                textAlign: "center",
                backgroundColor: "#fafafa",
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  margin: "0 auto 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#000000",
                  borderRadius: 3,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={LogoEmpresa}
                  alt="Logo Empresa"
                  style={{ width: "80%", height: "80%", objectFit: "contain" }}
                />
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
                Bienvenido
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  fontSize: "0.938rem",
                }}
              >
                Ingrese sus credenciales para acceder al sistema
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Box sx={{ mb: 3 }}>
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
                        autoFocus
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
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Controller
                    name="contrasenaLog"
                    control={control}
                    render={({ field }) => (
                      <InputTextCustom
                        {...field}
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        label="Contraseña"
                        error={!!errors.contrasenaLog}
                        helperText={errors.contrasenaLog?.message}
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
                                onClick={() => setShowPassword(!showPassword)}
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
                </Box>

                <ButtonCustom
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
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
                  Iniciar Sesión
                </ButtonCustom>

                <Divider sx={{ my: 3, color: "#94a3b8" }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", px: 2 }}
                  >
                    ¿Olvidó su contraseña?
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                    }}
                  >
                    Contacte al administrador del sistema
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <Box
              sx={{
                py: 2.5,
                px: 4,
                backgroundColor: "#fafafa",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "0.813rem",
                }}
              >
                © 2025 Todos los derechos reservados
              </Typography>
            </Box>
          </CardCustom>
        </Container>

        <SnackbarCustom
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => {
            setSnackbar({ ...snackbar, open: false });
            if (snackbar.severity === "success") navigate("/dashboard");
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
