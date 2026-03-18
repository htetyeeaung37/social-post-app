import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import Routes from "./Routes";

import { useState, createContext, useContext, useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppContext = createContext();

const queryClient = new QueryClient();

const api = `${import.meta.env.VITE_API_URL}/users/verify`;
const token = localStorage.getItem("token");

export default function AppPovider() {
	const [mode, setMode] = useState("dark");
	const [openDrawer, setOpenDrawer] = useState(false);
	const [auth, setAuth] = useState();

    useEffect(() => {
        if(token) {
            fetch(api, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then(async res => {
                if(res.ok) {
                    const user = await res.json();
                    setAuth(user);
                } else {
                    localStorage.removeItem("token");
                }
            });
        }
    }, []);

	const theme = createTheme({
		palette: { mode },
	});

	return (
		<AppContext.Provider
			value={{ mode, setMode, openDrawer, setOpenDrawer, auth, setAuth }}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<Routes />
					<CssBaseline />
				</ThemeProvider>
			</QueryClientProvider>
		</AppContext.Provider>
	);
}

export function useApp() {
	return useContext(AppContext);
}
