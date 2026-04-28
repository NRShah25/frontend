import api from './axios';

export const getBudgets = async (year, month) => {
    const response = await api.get('/budgets', {
        params: { year, month },
    });
    return response.data;
};

export const createOrUpdateBudget = async (budget) => {
    const response = await api.post('/budgets', budget);
    return response.data;
};

export const deleteBudget = async (id) => {
    await api.delete(`/budgets/${id}`);
};

export const getBudgetAlerts = async (year, month) => {
    const response = await api.get('/budgets/alerts', {
        params: { year, month },
    });
    return response.data;
};