import { Alert, Box, Button, OutlinedInput, Typography } from "@mui/material";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { useApp } from "../AppProvider";

const api = `${import.meta.env.VITE_API_URL}/users/login`;

export default function Login() {
	const [error, setError] = useState(false);

    const { setAuth } = useApp();

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = async data => {
		const res = await fetch(api, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const { user, token } = await res.json();
            setAuth(user);
            localStorage.setItem("token", token);
			navigate("/");
		} else {
			setError(true);
		}
	};

	return (
		<Box sx={{ mt: 4 }}>
			<Typography variant="h3">Login</Typography>

			{error && (
				<Alert
					severity="warning"
					sx={{ my: 3 }}>
					Incorrect username or password
				</Alert>
			)}

			<form onSubmit={handleSubmit(onSubmit)}>
				<OutlinedInput
					placeholder="username"
					fullWidth
					sx={{ mt: 2 }}
					{...register("username", { required: true })}
				/>
				{errors.username && (
					<Typography sx={{ color: "red" }}>
						username is required
					</Typography>
				)}

				<OutlinedInput
					type="password"
					placeholder="password"
					fullWidth
					sx={{ mt: 2 }}
					{...register("password", { required: true })}
				/>
				{errors.password && (
					<Typography sx={{ color: "red" }}>
						password is required
					</Typography>
				)}

				<Button
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 2 }}>
					Login
				</Button>
			</form>
		</Box>
	);
}
