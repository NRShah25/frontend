import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } />
            <Route path="/transactions" element={
                <PrivateRoute>
                    <Transactions />
                </PrivateRoute>
            } />
            <Route path="/budgets" element={
                <PrivateRoute>
                    <Budgets />
                </PrivateRoute>
            } />
        </Routes>
    );
}

export default App;