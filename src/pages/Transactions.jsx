import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions, createTransaction, deleteTransaction } from '../api/transactions';
import {
    Container, Box, Typography, Button, Card, CardContent,
    TextField, MenuItem, Select, FormControl, InputLabel,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Alert, CircularProgress, Chip, Grid
} from '@mui/material';
import { Delete, Add, ArrowBack } from '@mui/icons-material';

const CATEGORIES = ['FOOD', 'RENT', 'TRANSPORT', 'ENTERTAINMENT',
    'HEALTHCARE', 'SHOPPING', 'UTILITIES', 'SAVINGS', 'OTHER'];

const TYPES = ['INCOME', 'EXPENSE'];

function Transactions() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        amount: '',
        category: 'FOOD',
        description: '',
        type: 'EXPENSE',
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const data = await getTransactions();
            setTransactions(data);
        } catch (err) {
            setError('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createTransaction({
                ...form,
                amount: parseFloat(form.amount),
            });
            setSuccess('Transaction added successfully!');
            setForm({ amount: '', category: 'FOOD', description: '', type: 'EXPENSE' });
            setShowForm(false);
            fetchTransactions();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to create transaction');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id);
            setTransactions(transactions.filter(t => t.id !== id));
            setSuccess('Transaction deleted');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete transaction');
        }
    };

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
                        Transactions
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowForm(!showForm)}
                >
                    Add Transaction
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {/* Add Transaction Form */}
            {showForm && (
                <Card sx={{ mb: 4, borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            New Transaction
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%', px: 1 }}>
                                    <TextField
                                        label="Amount"
                                        type="number"
                                        value={form.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                        required
                                        sx={{ flex: 1, minWidth: 150 }}
                                        inputProps={{ min: 0.01, step: 0.01 }}
                                    />
                                    <FormControl sx={{ flex: 1, minWidth: 150 }}>
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            value={form.category}
                                            label="Category"
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        >
                                            {CATEGORIES.map(cat => (
                                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ flex: 1, minWidth: 150 }}>
                                        <InputLabel>Type</InputLabel>
                                        <Select
                                            value={form.type}
                                            label="Type"
                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        >
                                            {TYPES.map(type => (
                                                <MenuItem key={type} value={type}>{type}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Description"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        sx={{ flex: 2, minWidth: 200 }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{ minWidth: 120 }}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Transactions Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        No transactions yet. Add your first one!
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((t) => (
                                <TableRow key={t.id} hover>
                                    <TableCell>
                                        {new Date(t.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{t.description || '—'}</TableCell>
                                    <TableCell>
                                        <Chip label={t.category} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={t.type}
                                            size="small"
                                            color={t.type === 'INCOME' ? 'success' : 'error'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            fontWeight="bold"
                                            color={t.type === 'INCOME' ? 'success.main' : 'error.main'}
                                        >
                                            {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default Transactions;