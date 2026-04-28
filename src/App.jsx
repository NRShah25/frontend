import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
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