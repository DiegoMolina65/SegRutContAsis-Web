import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme/theme";
import { AppRouter } from "./routes/AppRouter";
import { UserProvider } from "./hooks/exportHooks";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;