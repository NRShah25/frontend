import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../api/transactions';
import { getBudgetAlerts } from '../api/budgets';
import {
    Container, Grid, Card, CardContent, Typography,
    Box, Alert, Button, CircularProgress
} from '@mui/material';
import {
    TrendingUp, TrendingDown, AccountBalance,
    Warning
} from '@mui/icons-material';
import {
    PieChart, Pie, Cell, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28',
    '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

function Dashboard() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [txData, alertData] = await Promise.all([
                    getTransactions(),
                    getBudgetAlerts(year, month)
                ]);
                setTransactions(txData);
                setAlerts(alertData);
            } catch (err) {
                console.error('Error fetching dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalIncome = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const categoryData = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, t) => {
            const existing = acc.find(item => item.name === t.category);
            if (existing) {
                existing.value += t.amount;
            } else {
                acc.push({ name: t.category, value: t.amount });
            }
            return acc;
        }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        FinanceTracker
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back, {user?.fullName}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/transactions')}>
                        Transactions
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/budgets')}>
                        Budgets
                    </Button>
                    <Button variant="outlined" color="error" onClick={logoutUser}>
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Budget Alerts */}
            {alerts.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    {alerts.map((alert) => (
                        <Alert
                            key={alert.id}
                            severity={alert.status === 'EXCEEDED' ? 'error' : 'warning'}
                            icon={<Warning />}
                            sx={{ mb: 1 }}
                        >
                            <strong>{alert.category}</strong> budget is {alert.status} —
                            spent ${alert.spentAmount.toFixed(2)} of ${alert.limitAmount.toFixed(2)}
                        </Alert>
                    ))}
                </Box>
            )}

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, bgcolor: '#e8f5e9' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Income
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" color="success.main">
                                        ${totalIncome.toFixed(2)}
                                    </Typography>
                                </Box>
                                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, bgcolor: '#ffebee' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Expenses
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" color="error.main">
                                        ${totalExpenses.toFixed(2)}
                                    </Typography>
                                </Box>
                                <TrendingDown sx={{ fontSize: 40, color: 'error.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, bgcolor: '#e3f2fd' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Balance
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                                        ${balance.toFixed(2)}
                                    </Typography>
                                </Box>
                                <AccountBalance sx={{ fontSize: 40, color: 'primary.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Pie Chart */}
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Spending by Category
                    </Typography>
                    {categoryData.length === 0 ? (
                        <Typography color="text.secondary">
                            No expense data yet. Add some transactions!
                        </Typography>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={index}
                                            fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}

export default Dashboard;