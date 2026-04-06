import { SEED_CATEGORIES } from '@/lib/categories';
import { financeReducer } from '@/lib/financeReducer';
import { storage } from '@/lib/storage';
import { Category, Transaction } from '@/types/finance';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

export type FinanceContextValue = {
    transactions: Transaction[];
    categories: Category[];
    hydrated: boolean;
    addTransaction: (transaction: Transaction) => void;
    updateTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: string) => void;
    addCategory: (category: Category) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (id: string) => void;
};

const FinanceContext = createContext<FinanceContextValue | null>(null);

const emptyState = {
    transactions: [] as Transaction[],
    categories: [] as Category[],
    hydrated: false,
};

export function FinanceProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(financeReducer, emptyState);

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                const [transactions, categories] = await Promise.all([
                    storage.getTransactions(),
                    storage.getCategories(),
                ]);
                if (cancelled) return;
                dispatch({
                    type: 'HYDRATE',
                    payload: {
                        transactions,
                        categories: categories.length > 0 ? categories : SEED_CATEGORIES,
                    },
                });
            } catch {
                if (!cancelled) {
                    dispatch({
                        type: 'HYDRATE',
                        payload: { transactions: [], categories: SEED_CATEGORIES },
                    });
                }
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!state.hydrated) return;
        storage.saveTransactions(state.transactions);
        storage.saveCategories(state.categories);
    }, [state.transactions, state.categories, state.hydrated]);

    const addTransaction = useCallback((transaction: Transaction) => {
        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    }, []);

    const updateTransaction = useCallback((transaction: Transaction) => {
        dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
    }, []);

    const deleteTransaction = useCallback((id: string) => {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }, []);

    const addCategory = useCallback((category: Category) => {
        dispatch({ type: 'ADD_CATEGORY', payload: category });
    }, []);

    const updateCategory = useCallback((category: Category) => {
        dispatch({ type: 'UPDATE_CATEGORY', payload: category });
    }, []);

    const deleteCategory = useCallback((id: string) => {
        dispatch({ type: 'DELETE_CATEGORY', payload: id });
    }, []);

    const value = useMemo<FinanceContextValue>(() => ({
        transactions: state.transactions,
        categories: state.categories,
        hydrated: state.hydrated,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
    }), [state.transactions, state.categories, state.hydrated, addTransaction, updateTransaction, deleteTransaction, addCategory, updateCategory, deleteCategory]);

    return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance(): FinanceContextValue {
    const context = useContext(FinanceContext);
    if (context == null) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}
