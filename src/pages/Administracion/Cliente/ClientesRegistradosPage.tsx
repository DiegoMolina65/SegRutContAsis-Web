import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  SearchOutlined,
  AddCircleOutline,
  PeopleOutline,
} from "@mui/icons-material";
import type { ClienteResponseDTO } from "../../../types/exportTypes";
import type { Column } from "../../../components/ui/TableCustom";
import { useCliente } from "../../../hooks/exportHooks";
import { SnackbarCustom, TableCustom, InputTextCustom, ButtonCustom} from "../../../components/ui/exportComponentsUI";

type ClienteTableDTO = ClienteResponseDTO & { id: number };

const ClientesRegistradosPage: React.FC = () => {
  const { clientes, obtenerClientesHook, deshabilitarClientePorId } = useCliente();
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
    obtenerClientesHook();
  }, [obtenerClientesHook]);

  const handleDisable = async (row: ClienteTableDTO) => {
    try {
      await deshabilitarClientePorId(row.id);
      setSnackbar({
        open: true,
        message: "Cliente deshabilitado correctamente.",
        severity: "success",
      });
      obtenerClientesHook();
    } catch (error) {
      console.error("Error deshabilitando cliente:", error);
      setSnackbar({
        open: true,
        message: "Error al deshabilitar el cliente.",
        severity: "error",
      });
    }
  };

  const handleEdit = (row: ClienteTableDTO) => {
    navigate(`/cliente/registro?id=${row.id}`);
  };

  const handleNewClient = () => {
    navigate("/cliente/registro");
  };

  const columns: Column<ClienteTableDTO>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "clNombreCompleto",
      headerName: "Nombre Completo",
      width: 200,
    },
    {
      field: "clCarnetIdentidad",
      headerName: "Carnet de Identidad",
      width: 150,
    },
    {
      field: "clNitCliente",
      headerName: "NIT Cliente",
      width: 120,
    },
    {
      field: "clTipoCliente",
      headerName: "Tipo de Cliente",
      width: 150,
    },
    {
      field: "clTelefono",
      headerName: "Teléfono",
      width: 150,
    },
  ];

  const mappedClientes: ClienteTableDTO[] = clientes.map((c) => ({
    ...c,
    id: c.clId,
  }));

  const filteredClientes = mappedClientes.filter(
    (cliente) =>
      cliente.clNombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.clCarnetIdentidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.clNitCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.clTelefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.clTipoCliente && cliente.clTipoCliente.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <PeopleOutline sx={{ fontSize: 24, color: "#475569" }} />
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
                Clientes Registrados
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  mt: 0.5,
                }}
              >
                Gestión y administración de clientes en el sistema
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
              Total de clientes:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#1e293b",
                fontWeight: 700,
              }}
            >
              {clientes.length}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
        >
          <InputTextCustom
            placeholder="Buscar por nombre, carnet, NIT o teléfono..."
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
            startIcon={<AddCircleOutline />}
            onClick={handleNewClient}
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
            Nuevo Cliente
          </ButtonCustom>
        </Stack>
      </Box>

      <Card
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableCustom<ClienteTableDTO>
            columns={columns}
            rows={filteredClientes}
            title="Lista de Clientes"
            searchField="clNombreCompleto"
            onEdit={handleEdit}
            onDelete={handleDisable}
            getRowId={(row) => row.id}
          />
        </CardContent>
      </Card>

      <SnackbarCustom
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default ClientesRegistradosPage;
