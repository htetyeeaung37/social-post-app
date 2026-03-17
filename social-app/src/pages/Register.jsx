import { Alert, Box, Button, OutlinedInput, Typography } from "@mui/material";
import { useState } from "react";

import { useForm } from "react-hook-form";

import { useNavigate } from "react-router";

const api = "http://localhost:8800/users";

export default function Register() {
	const [error, setError] = useState();

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
			navigate("/login");
		} else {
			setError(true);
		}
	};

	return (
		<Box sx={{ mt: 4 }}>
			<Typography variant="h3">Register</Typography>

			{error && (
				<Alert
					severity="warning"
					sx={{ my: 3 }}>
					Something went wrong
				</Alert>
			)}

			<form onSubmit={handleSubmit(onSubmit)}>
				<OutlinedInput
					placeholder="name"
					fullWidth
					sx={{ mt: 2 }}
					{...register("name", { required: true })}
				/>
				{errors.name && (
					<Typography sx={{ color: "red" }}>
						name is required
					</Typography>
				)}

				<OutlinedInput
					placeholder="username"
					fullWidth
					sx={{ mt: 2 }}
					{...register("username", { required: true })}
				/>
				{errors.username && (
					<Typography sx={{ color: "red" }}>
						name is required
					</Typography>
				)}

				<OutlinedInput
					placeholder="bio"
					fullWidth
					sx={{ mt: 2 }}
					{...register("bio")}
				/>
				<OutlinedInput
					type="password"
					placeholder="password"
					fullWidth
					sx={{ mt: 2 }}
					{...register("password", { required: true })}
				/>
				{errors.password && (
					<Typography sx={{ color: "red" }}>
						name is required
					</Typography>
				)}

				<Button
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 2 }}>
					Register
				</Button>
			</form>
		</Box>
	);
}
