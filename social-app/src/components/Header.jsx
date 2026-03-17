import { useApp } from "../AppProvider";

import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

import {
	Menu as MenuIcon,
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
    ArrowBack as BackIcon,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router";

export default function Header() {
	const { mode, setMode, setOpenDrawer } = useApp();

    const { pathname } = useLocation();
    const navigate = useNavigate();

	return (
		<AppBar position="static">
			<Toolbar>
				{pathname == "/" ? (
					<IconButton sx={{ mr: 2 }} color="inherit" onClick={() => setOpenDrawer(true)}>
						<MenuIcon />
					</IconButton>
				) : (
					<IconButton sx={{ mr: 2 }} color="inherit" onClick={() => navigate("/")}>
						<BackIcon />
					</IconButton>
				)}

				<Typography sx={{ flexGrow: 1 }}>Social</Typography>
				{mode === "dark" ? (
					<IconButton
						color="inherit"
						onClick={() => setMode("light")}>
						<LightModeIcon />
					</IconButton>
				) : (
					<IconButton
						color="inherit"
						onClick={() => setMode("dark")}>
						<DarkModeIcon />
					</IconButton>
				)}
			</Toolbar>
		</AppBar>
	);
}
