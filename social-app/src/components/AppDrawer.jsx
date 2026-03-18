import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
    useTheme
} from "@mui/material";
import {
    Home as HomeIcon,
    Person as ProfileIcon,
    PersonAdd as RegisterIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";
import { useNavigate, useLocation } from "react-router";

export default function AppDrawer() {
    const { openDrawer, setOpenDrawer, auth, setAuth } = useApp();
    const navigate = useNavigate();
    const location = useLocation(); 
    const theme = useTheme();

    const handleNavigate = (path) => {
        navigate(path);
        setOpenDrawer(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setAuth(undefined);
        setOpenDrawer(false);
        navigate("/login");
    };

    return (
        <Drawer
            anchor="left"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            PaperProps={{
                sx: { 
                    width: 280, 
                    borderRadius: "0 20px 20px 0",
                    bgcolor: "background.paper"
                }
            }}
        >
            {/* Header Section - အပြာရောင် Gradient ပြောင်းထားသည် */}
            <Box
                sx={{
                    background: auth 
                        ? `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)` 
                        : "linear-gradient(45deg, #455a64 30%, #90a4ae 90%)",
                    height: 170,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    px: 3,
                    color: "white",
                }}
            >
                {auth ? (
                    <>
                        <Avatar
                            sx={{ 
                                width: 64, 
                                height: 64, 
                                mb: 1.5,
                                bgcolor: "primary.light",
                                color: "primary.contrastText",
                                border: "3px solid rgba(255,255,255,0.8)",
                                fontWeight: "bold",
                                fontSize: "1.5rem"
                            }}
                        >
                            {auth.name[0].toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                            {auth.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.85, letterSpacing: 0.5 }}>
                            @{auth.username}
                        </Typography>
                    </>
                ) : (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
                            Social App
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Connect with everyone
                        </Typography>
                    </Box>
                )}
            </Box>

            <List sx={{ p: 1.5 }}>
                <ListItem disablePadding>
                    <ListItemButton 
                        selected={location.pathname === "/"}
                        onClick={() => handleNavigate("/")}
                        sx={{ 
                            borderRadius: 3, 
                            mb: 0.5,
                            "&.Mui-selected": {
                                bgcolor: "rgba(130, 193, 241, 0.15)",
                                "&:hover": { bgcolor: "rgba(130, 193, 241, 0.25)" }
                            }
                        }}
                    >
                        <ListItemIcon>
                            <HomeIcon color={location.pathname === "/" ? "primary" : "inherit"} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Home" 
                            primaryTypographyProps={{ 
                                fontWeight: location.pathname === "/" ? 700 : 500,
                                color: location.pathname === "/" ? "primary.main" : "inherit"
                            }} 
                        />
                    </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1.5, opacity: 0.5 }} />

                {auth ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton 
                                selected={location.pathname === "/profile"}
                                onClick={() => handleNavigate("/profile")}
                                sx={{ 
                                    borderRadius: 3, 
                                    mb: 0.5,
                                    "&.Mui-selected": {
                                        bgcolor: "rgba(130, 193, 241, 0.15)",
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <ProfileIcon color={location.pathname === "/profile" ? "primary" : "inherit"} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Profile" 
                                    primaryTypographyProps={{ 
                                        fontWeight: location.pathname === "/profile" ? 700 : 500,
                                        color: location.pathname === "/profile" ? "primary.main" : "inherit"
                                    }} 
                                />
                            </ListItemButton>
                        </ListItem>
                        
                        <ListItem disablePadding>
                            <ListItemButton 
                                onClick={handleLogout}
                                sx={{ 
                                    borderRadius: 3, 
                                    color: "error.main",
                                    mt: 1,
                                    "&:hover": { bgcolor: "error.lighter" }
                                }}
                            >
                                <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                                <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton 
                                selected={location.pathname === "/register"}
                                onClick={() => handleNavigate("/register")}
                                sx={{ borderRadius: 3, mb: 0.5 }}
                            >
                                <ListItemIcon>
                                    <RegisterIcon color={location.pathname === "/register" ? "primary" : "inherit"} />
                                </ListItemIcon>
                                <ListItemText primary="Register" primaryTypographyProps={{ fontWeight: 500 }} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton 
                                selected={location.pathname === "/login"}
                                onClick={() => handleNavigate("/login")}
                                sx={{ borderRadius: 3 }}
                            >
                                <ListItemIcon>
                                    <LoginIcon color={location.pathname === "/login" ? "primary" : "inherit"} />
                                </ListItemIcon>
                                <ListItemText primary="Login" primaryTypographyProps={{ fontWeight: 500 }} />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Drawer>
    );
}