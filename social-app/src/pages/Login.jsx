import { 
    Alert, 
    Box, 
    Button, 
    OutlinedInput, 
    Typography, 
    Card, 
    CardContent, 
    Container, 
    FormHelperText,
    useTheme
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";

const api = `${import.meta.env.VITE_API_URL}/users/login`;

export default function Login() {
    const [error, setError] = useState(false);
    const { setAuth } = useApp();
    const navigate = useNavigate();
    const theme = useTheme(); 

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
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
        } catch (err) {
            setError(true);
        }
    };

    const inputStyle = {
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', 
        borderRadius: 2.5,
        transition: 'all 0.3s ease',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#82C1F1',
        },
        '&.Mui-focused': {
            bgcolor: 'transparent',
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#82C1F1', 
                borderWidth: '2px',
            },
        },
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: 'background.default', 
            transition: 'background-color ease'
        }}>
            <Container maxWidth="sm">
                <Card sx={{ 
                    borderRadius: 4, 
                    boxShadow: theme.palette.mode === 'dark' ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 40px rgba(0,0,0,0.1)',
                    bgcolor: 'background.paper', // Light mode မှာ အဖြူ၊ Dark mode မှာ အမည်း အလိုအလျောက် ဖြစ်ပါမယ်
                    backgroundImage: 'none',
                    border: '1px solid',
                    borderColor: 'divider'
                }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ 
                            fontWeight: 800, 
                            textAlign: 'center', 
                            color: 'text.primary',
                            letterSpacing: -0.5
                        }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
                            Please enter your details to login
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                Incorrect username or password
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ mb: 2.5 }}>
                                <OutlinedInput
                                    placeholder="Username"
                                    fullWidth
                                    sx={inputStyle}
                                    {...register("username", { required: "Username is required" })}
                                    error={!!errors.username}
                                />
                                {errors.username && <FormHelperText error sx={{ ml: 1 }}>{errors.username.message}</FormHelperText>}
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <OutlinedInput
                                    type="password"
                                    placeholder="Password"
                                    fullWidth
                                    sx={inputStyle}
                                    {...register("password", { required: "Password is required" })}
                                    error={!!errors.password}
                                />
                                {errors.password && <FormHelperText error sx={{ ml: 1 }}>{errors.password.message}</FormHelperText>}
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{ 
                                    py: 1.8, 
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    bgcolor: '#82C1F1',
                                    color: '#fff',
                                    '&:hover': { 
                                        bgcolor: '#64B5F6',
                                        boxShadow: '0 6px 20px rgba(130, 193, 241, 0.4)'
                                    }
                                }}
                            >
                                Login
                            </Button>
                        </form>

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Don't have an account? 
                                <Button 
                                    onClick={() => navigate("/register")}
                                    sx={{ 
                                        ml: 0.5, 
                                        fontWeight: 700, 
                                        color: '#82C1F1', 
                                        textTransform: 'none',
                                        '&:hover': { background: 'transparent', textDecoration: 'underline' }
                                    }}
                                >
                                    Register
                                </Button>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}