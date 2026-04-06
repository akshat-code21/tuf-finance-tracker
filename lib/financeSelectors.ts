import { Transaction } from '@/types/finance';
import { endOfMonth, startOfMonth } from 'date-fns';

export const getMonthBounds = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
};

export const filterTransactionsByMonth = (
  transactions: Transaction[],
  monthBounds: { start: Date; end: Date }
) => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= monthBounds.start && transactionDate <= monthBounds.end;
  });
};

export const getMonthlySummary = (transactions: Transaction[]) => {
  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    remainingBalance: 0,
  };
  transactions.forEach((transaction) => {
    if (transaction.type === 'income') {
      summary.totalIncome += transaction.amount;
    } else {
      summary.totalExpenses += transaction.amount;
    }
  });
  summary.remainingBalance = summary.totalIncome - summary.totalExpenses;
  return summary;
};

/** Same aggregates as getMonthlySummary (per-category breakdown can be added later). */
export const getCategoriesSummary = (transactions: Transaction[]) => {
  return getMonthlySummary(transactions);
};

export const getMonthlyTotal = (transactions: Transaction[]) => {
  return getMonthlySummary(transactions).remainingBalance;
};
