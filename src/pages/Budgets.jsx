import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBudgets, createOrUpdateBudget, deleteBudget } from "../api/budgets";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
} from "@mui/material";
import { Delete, Add, ArrowBack } from "@mui/icons-material";

const CATEGORIES = [
  "FOOD",
  "RENT",
  "TRANSPORT",
  "ENTERTAINMENT",
  "HEALTHCARE",
  "SHOPPING",
  "UTILITIES",
  "SAVINGS",
  "OTHER",
];

function Budgets() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [form, setForm] = useState({
    category: "FOOD",
    limitAmount: "",
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  useEffect(() => {
    fetchBudgets();
  }, [year, month]);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const data = await getBudgets(year, month);
      setBudgets(data);
    } catch (err) {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createOrUpdateBudget({
        ...form,
        limitAmount: parseFloat(form.limitAmount),
      });
      setSuccess("Budget saved successfully!");
      setForm({ category: "FOOD", limitAmount: "", month, year });
      setShowForm(false);
      fetchBudgets();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save budget");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      setBudgets(budgets.filter((b) => b.id !== id));
      setSuccess("Budget deleted");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete budget");
    }
  };

  const getStatusColor = (status) => {
    if (status === "EXCEEDED") return "error";
    if (status === "WARNING") return "warning";
    return "success";
  };

  const getProgressColor = (status) => {
    if (status === "EXCEEDED") return "error";
    if (status === "WARNING") return "warning";
    return "success";
  };

  const getProgressValue = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    return Math.min(percentage, 100);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Budgets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set and track your monthly spending limits
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowForm(!showForm)}
        >
          Add Budget
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Month Selector */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={month}
            label="Month"
            onChange={(e) => setMonth(e.target.value)}
          >
            {monthNames.map((name, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          sx={{ width: 100 }}
        />
      </Box>

      {/* Add Budget Form */}
      {showForm && (
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Set Budget
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
            >
              <FormControl sx={{ flex: 1, minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  label="Category"
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Monthly Limit ($)"
                type="number"
                value={form.limitAmount}
                onChange={(e) =>
                  setForm({ ...form, limitAmount: e.target.value })
                }
                required
                sx={{ flex: 1, minWidth: 150 }}
                inputProps={{ min: 1, step: 0.01 }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={form.month}
                  label="Month"
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                >
                  {monthNames.map((name, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Year"
                type="number"
                value={form.year}
                onChange={(e) =>
                  setForm({ ...form, year: parseInt(e.target.value) })
                }
                sx={{ width: 100 }}
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
          </CardContent>
        </Card>
      )}

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography color="text.secondary">
              No budgets set for {monthNames[month - 1]} {year}. Click "Add
              Budget" to get started!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {budgets.map((budget) => (
            <Grid item xs={12} md={6} lg={4} key={budget.id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {budget.category}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={budget.status}
                        color={getStatusColor(budget.status)}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(budget.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={getProgressValue(
                      budget.spentAmount,
                      budget.limitAmount,
                    )}
                    color={getProgressColor(budget.status)}
                    sx={{ mb: 2, height: 8, borderRadius: 4 }}
                  />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Spent: <strong>${budget.spentAmount.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Limit: <strong>${budget.limitAmount.toFixed(2)}</strong>
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Remaining:{" "}
                    <strong>${budget.remainingAmount.toFixed(2)}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Budgets;
