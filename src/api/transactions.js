import api from './axios';

export const getTransactions = async () => {
    const response = await api.get('/transactions');
    return response.data;
};

export const createTransaction = async (transaction) => {
    const response = await api.post('/transactions', transaction);
    return response.data;
};

export const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
};

export const getMonthlySummary = async (type, year, month) => {
    const response = await api.get('/transactions/summary', {
        params: { type, year, month },
    });
    return response.data;
};
 export const getMonthlyReport = async (year) => {
    const response = await api.get("/transactions/report", {
      params: { year },
    });
    return response.data;
  };