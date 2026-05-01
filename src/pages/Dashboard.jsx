import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTransactions, getMonthlyReport } from "../api/transactions";
import { getBudgetAlerts } from "../api/budgets";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Warning,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
];

function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, alertData, reportData] = await Promise.all([
          getTransactions(),
          getBudgetAlerts(year, month),
          getMonthlyReport(year),
        ]);
        setTransactions(txData);
        setAlerts(alertData);
        setReport(reportData);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categoryData = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  const recentTransactions = [...transactions].slice(0, 5);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back, {user?.fullName} —{" "}
          {now.toLocaleString("default", { month: "long" })} {year}
        </Typography>
      </Box>

      {/* Budget Alerts */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              severity={alert.status === "EXCEEDED" ? "error" : "warning"}
              icon={<Warning />}
              sx={{ mb: 1 }}
            >
              <strong>{alert.category}</strong> budget is {alert.status} — spent
              ${alert.spentAmount.toFixed(2)} of ${alert.limitAmount.toFixed(2)}
            </Alert>
          ))}
        </Box>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: "#e8f5e9" }}>
<CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Income
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    ${totalIncome.toFixed(2)}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: "success.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: "#ffebee" }}>
<CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Expenses
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    ${totalExpenses.toFixed(2)}
                  </Typography>
                </Box>
                <TrendingDown sx={{ fontSize: 40, color: "error.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: "#e3f2fd" }}>
<CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Net Balance
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    ${balance.toFixed(2)}
                  </Typography>
                </Box>
                <AccountBalance sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bar Chart - Full Width */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Income vs Expenses {year}
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
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

      {/* Pie Chart + Top Categories */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Spending by Category
              </Typography>
              {categoryData.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 260,
                  }}
                >
                  <Typography color="text.secondary">
                    No expense data yet
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Top Spending Categories
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell>
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Amount</strong>
                      </TableCell>
                      <TableCell>
                        <strong>% of Expenses</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryData
                      .sort((a, b) => b.value - a.value)
                      .map((cat, index) => (
                        <TableRow key={cat.name} hover>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor: COLORS[index % COLORS.length],
                                }}
                              />
                              {cat.name}
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{ color: "error.main", fontWeight: "bold" }}
                          >
                            ${cat.value.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {((cat.value / totalExpenses) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
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
              Recent Transactions
            </Typography>
            <Button size="small" onClick={() => navigate("/transactions")}>
              View All
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Amount</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">
                        No transactions yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentTransactions.map((t) => (
                    <TableRow key={t.id} hover>
                      <TableCell>
                        {new Date(t.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{t.description || "—"}</TableCell>
                      <TableCell>
                        <Chip label={t.category} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontWeight="bold"
                          color={
                            t.type === "INCOME" ? "success.main" : "error.main"
                          }
                        >
                          {t.type === "INCOME" ? "+" : "-"}$
                          {t.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Dashboard;
