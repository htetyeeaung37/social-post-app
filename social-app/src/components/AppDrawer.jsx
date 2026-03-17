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
} from "@mui/material";
import { green, grey } from "@mui/material/colors";

import {
	Home as HomeIcon,
	Person as ProfileIcon,
	PersonAdd as RegisterIcon,
	Login as LoginIcon,
	Logout as LogoutIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";

import { useNavigate } from "react-router";

export default function AppDrawer() {
	const { openDrawer, setOpenDrawer, auth, setAuth } = useApp();
	const navigate = useNavigate();

	return (
		<Drawer
			open={openDrawer}
			onClose={() => setOpenDrawer(false)}
			onClick={() => setOpenDrawer(false)}>
			<Box
				sx={{
					background: auth ? green[500] : grey[500],
					width: 300,
					height: 180,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					color: "white",
				}}>
				{auth ? (
					<>
						<Avatar
							sx={{ 
								width: 64, 
								height: 64, 
								mb: 2,
								bgcolor: "rgba(255,255,255,0.2)",
								fontSize: "1.5rem"
							}}
						>
							{auth.name[0]}
						</Avatar>
						<Typography variant="h6" sx={{ fontWeight: "bold" }}>
							{auth.name}
						</Typography>
						<Typography variant="body2" sx={{ opacity: 0.8 }}>
							@{auth.username}
						</Typography>
					</>
				) : (
					<Typography variant="h6">
						Welcome to Social
					</Typography>
				)}
			</Box>

			<List>
				<ListItem>
					<ListItemButton onClick={() => navigate("/")}>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItemButton>
				</ListItem>
				<Divider />

				{auth && (
					<>
						<ListItem>
							<ListItemButton
								onClick={() => navigate("/profile")}>
								<ListItemIcon>
									<ProfileIcon />
								</ListItemIcon>
								<ListItemText primary="Profile" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton onClick={() => {
								localStorage.removeItem("token");
								setAuth(undefined);
							}}>
								<ListItemIcon>
									<LogoutIcon />
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItemButton>
						</ListItem>
					</>
				)}

				{!auth && (
					<>
						<ListItem>
							<ListItemButton
								onClick={() => navigate("/register")}>
								<ListItemIcon>
									<RegisterIcon />
								</ListItemIcon>
								<ListItemText primary="Register" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								onClick={() => navigate("/login")}>
								<ListItemIcon>
									<LoginIcon />
								</ListItemIcon>
								<ListItemText primary="Login" />
							</ListItemButton>
						</ListItem>
					</>
				)}
			</List>
		</Drawer>
	);
}
