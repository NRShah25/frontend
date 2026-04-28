import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import {
    Container, Box, TextField, Button, Typography,
    Alert, Paper, CircularProgress
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);
            loginUser(data);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <AccountBalanceIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold">
                            FinanceTracker
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to your account
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Sign In'}
                        </Button>
                        <Typography variant="body2" textAlign="center">
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: '#1976d2' }}>
                                Register here
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Login;