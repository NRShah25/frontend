import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMonthlyReport } from '../api/transactions';
import {
    Container, Box, Typography, Card, CardContent,
    IconButton, CircularProgress, Alert, TextField,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Grid
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, LineChart,
    Line
} from 'recharts';

function Reports() {
    const navigate = useNavigate();
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchReport();
    }, [year]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const data = await getMonthlyReport(year);
            setReport(data);
        } catch (err) {
            setError('Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    const totalIncome = report.reduce((sum, m) => sum + m.income, 0);
    const totalExpenses = report.reduce((sum, m) => sum + m.expenses, 0);
    const totalBalance = totalIncome - totalExpenses;

    const activeMonths = report.filter(m =>
        m.income > 0 || m.expenses > 0);

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/')}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" fontWeight="bold">
                        Monthly Reports
                    </Typography>
                </Box>
                <TextField
                    label="Year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    sx={{ width: 100 }}
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, bgcolor: '#e8f5e9' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Total Income {year}
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="success.main">
                                ${totalIncome.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, bgcolor: '#ffebee' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Total Expenses {year}
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="error.main">
                                ${totalExpenses.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, bgcolor: '#e3f2fd' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Net Balance {year}
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="primary.main">
                                ${totalBalance.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Bar Chart */}
            <Card sx={{ borderRadius: 3, mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                        Income vs Expenses by Month
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={report}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="income" name="Income" fill="#4caf50" />
                            <Bar dataKey="expenses" name="Expenses" fill="#f44336" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Line Chart */}
            <Card sx={{ borderRadius: 3, mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                        Balance Trend
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={report}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="balance"
                                name="Balance"
                                stroke="#1976d2"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Monthly Table */}
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Monthly Breakdown
                    </Typography>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell><strong>Month</strong></TableCell>
                                    <TableCell><strong>Income</strong></TableCell>
                                    <TableCell><strong>Expenses</strong></TableCell>
                                    <TableCell><strong>Balance</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {report.map((row) => (
                                    <TableRow key={row.month} hover
                                        sx={{ opacity: row.income === 0 && row.expenses === 0 ? 0.4 : 1 }}>
                                        <TableCell><strong>{row.month}</strong></TableCell>
                                        <TableCell sx={{ color: 'success.main' }}>
                                            ${row.income.toFixed(2)}
                                        </TableCell>
                                        <TableCell sx={{ color: 'error.main' }}>
                                            ${row.expenses.toFixed(2)}
                                        </TableCell>
                                        <TableCell sx={{
                                            color: row.balance >= 0 ? 'primary.main' : 'error.main',
                                            fontWeight: 'bold'
                                        }}>
                                            ${row.balance.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Container>
    );
}

export default Reports;