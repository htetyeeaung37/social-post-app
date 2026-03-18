import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Routes from "./Routes";
import { useState, createContext, useContext, useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppContext = createContext();
const queryClient = new QueryClient();

export default function AppProvider() {
    const [mode, setMode] = useState("dark");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [auth, setAuth] = useState();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const api = `${import.meta.env.VITE_API_URL}/users/verify`;
            fetch(api, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(async (res) => {
                if (res.ok) {
                    const user = await res.json();
                    setAuth(user);
                } else {
                    localStorage.removeItem("token");
                    setAuth(undefined);
                }
            }).catch(() => {
                localStorage.removeItem("token");
                setAuth(undefined);
            });
        }
    }, []);

    
    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {
                main: "#82C1F1", 
                contrastText: "#ffffff",
            },
            background: {
                default: mode === "dark" ? "#0A1929" : "#F8FAFC",
                paper: mode === "dark" ? "#112233" : "#ffffff",
            },
        },
        shape: {
            borderRadius: 12, 
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none", 
                        fontWeight: 600,
                    },
                },
            },
        },
    }), [mode]);

    return (
        <AppContext.Provider
            value={{ mode, setMode, openDrawer, setOpenDrawer, auth, setAuth }}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Routes />
                </ThemeProvider>
            </QueryClientProvider>
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}