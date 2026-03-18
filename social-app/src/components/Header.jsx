import { useApp } from "../AppProvider";
import { AppBar, IconButton, Toolbar, Typography, Box, useTheme } from "@mui/material";
import {
    Menu as MenuIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    ArrowBack as BackIcon,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router";

export default function Header() {
    const { mode, setMode, setOpenDrawer } = useApp();
    const theme = useTheme();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const getTitle = () => {
        if (pathname === "/") return "Social Feed";
        if (pathname === "/profile") return "My Profile";
        if (pathname.startsWith("/posts/")) return "View Post";
        return "Social App";
    };

    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
                bgcolor: mode === "dark" ? "background.paper" : "primary.main",
                borderBottom: "1px solid",
                borderColor: "divider",
                backdropFilter: "blur(8px)", 
            }}
        >
            <Toolbar>
                {pathname === "/" ? (
                    <IconButton 
                        edge="start"
                        sx={{ mr: 1 }} 
                        color="inherit" 
                        onClick={() => setOpenDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                ) : (
                    <IconButton 
                        edge="start"
                        sx={{ mr: 1 }} 
                        color="inherit" 
                        onClick={() => navigate(-1)} 
                    >
                        <BackIcon />
                    </IconButton>
                )}

                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: "bold",
                        letterSpacing: 0.5,
                        ml: 1
                    }}
                >
                    {getTitle()}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {mode === "dark" ? (
                        <IconButton
                            color="inherit"
                            onClick={() => setMode("light")}
                            sx={{ bgcolor: "rgba(255,255,255,0.05)", ml: 1 }}
                        >
                            <LightModeIcon sx={{ color: "warning.main" }} />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={() => setMode("dark")}
                            sx={{ bgcolor: "rgba(0,0,0,0.05)", ml: 1 }}
                        >
                            <DarkModeIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}