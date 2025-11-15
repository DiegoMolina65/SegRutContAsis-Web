import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Chip, 
  CardContent,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  SearchOutlined,
  PersonAddOutlined,
  GroupOutlined,
} from "@mui/icons-material";
import { obtenerUsuarios, deshabilitarUsuario } from "../../../api/exportApi";
import type { UsuarioResponseDTO } from "../../../types/exportTypes";
import { TableCustom, InputTextCustom, CardCustom, ButtonCustom} from "../../../components/ui/exportComponentsUI";
import type { Column } from "../../../components/ui/TableCustom";

type UsuarioTableDTO = UsuarioResponseDTO & { id: number };

const UsuariosRegistradosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioTableDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      const mapped: UsuarioTableDTO[] = data.map((u) => ({
        ...u,
        id: u.usrId,
      }));
      setUsuarios(mapped);
    } catch (error) {
      console.error("Error obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDisable = async (row: UsuarioTableDTO) => {
    try {
      await deshabilitarUsuario(row.usrId);
      fetchUsuarios();
    } catch (error) {
      console.error("Error deshabilitando usuario:", error);
    }
  };

  const handleEdit = (row: UsuarioTableDTO) => {
    navigate(`/usuarios/registro?id=${row.usrId}`);
  };

  const handleNewUser = () => {
    navigate("/usuarios/registro");
  };

  const columns: Column<UsuarioTableDTO>[] = [
    { 
      field: "usrId", 
      headerName: "ID", 
      width: 80 
    },
    { 
      field: "usrNombreCompleto", 
      headerName: "Nombre Completo", 
      width: 200 
    },
    { 
      field: "usrUsuarioLog", 
      headerName: "Usuario", 
      width: 150 
    },
    { 
      field: "usrCorreo", 
      headerName: "Correo", 
      width: 200 
    },
    { 
      field: "usrTelefono", 
      headerName: "Teléfono", 
      width: 150 
    },
    { 
      field: "usrNitEmpleado", 
      headerName: "NIT", 
      width: 120 
    },
    { 
      field: "usrCarnetIdentidad", 
      headerName: "Carnet", 
      width: 120 
    },
    {
      field: "roles",
      headerName: "Roles",
      width: 200,
      render: (row: UsuarioTableDTO) => (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {row.roles.map((rol) => (
            <Chip 
              key={rol} 
              label={rol} 
              size="small"
              sx={{
                backgroundColor: "#1e293b",
                color: "white",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          ))}
        </Box>
      ),
    },
  ];

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.usrNombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.usrUsuarioLog?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.usrCorreo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box 
      sx={{ 
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
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
              <GroupOutlined sx={{ fontSize: 24, color: "#475569" }} />
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
                Usuarios Registrados
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  mt: 0.5,
                }}
              >
                Gestión y administración de usuarios del sistema
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
              sx={{ 
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              Total de registrados:
            </Typography>
            <Typography
              variant="h6"
              sx={{ 
                color: "#1e293b", 
                fontWeight: 700,
              }}
            >
              {usuarios.length}
            </Typography>
          </Box>
        </Stack>

        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={2}
        >
          <InputTextCustom
            placeholder="Buscar por nombre, usuario o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f8fafc",
              },
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
            startIcon={<PersonAddOutlined />}
            onClick={handleNewUser}
            sx={{
              backgroundColor: "#1e293b",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.25,
              "&:hover": {
                backgroundColor: "#0f172a",
              },
              whiteSpace: "nowrap",
            }}
          >
            Nuevo Usuario
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
          <TableCustom<UsuarioTableDTO>
            columns={columns}
            rows={filteredUsuarios}
            title="Lista de Usuarios"
            searchField="usrNombreCompleto"
            onEdit={handleEdit}
            onDelete={handleDisable}
          />
        </CardContent>
      </CardCustom>
    </Box>
  );
};

export default UsuariosRegistradosPage;