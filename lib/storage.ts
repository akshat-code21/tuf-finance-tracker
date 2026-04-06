import { Category, Transaction } from '@/types/finance';
import { parseStoredCategory, parseStoredTransaction } from '@/lib/financeSerialization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
} as const;

export const storage = {
  getTransactions: async (): Promise<Transaction[]> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return Array.isArray(parsed) ? parsed.map(parseStoredTransaction) : [];
  },
  getCategories: async (): Promise<Category[]> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return Array.isArray(parsed) ? parsed.map(parseStoredCategory) : [];
  },
  saveTransactions: async (transactions: Transaction[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },
  saveCategories: async (categories: Category[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },
  deleteTransaction: async (id: string) => {
    const transactions = await storage.getTransactions();
    const filteredTransactions = transactions.filter((t) => t.id !== id);
    await storage.saveTransactions(filteredTransactions);
  },
  deleteCategory: async (id: string) => {
    const categories = await storage.getCategories();
    const filteredCategories = categories.filter((c) => c.id !== id);
    await storage.saveCategories(filteredCategories);
  },
  updateTransaction: async (transaction: Transaction) => {
    const transactions = await storage.getTransactions();
    const updatedTransactions = transactions.map((t) =>
      t.id === transaction.id ? transaction : t
    );
    await storage.saveTransactions(updatedTransactions);
  },
  updateCategory: async (category: Category) => {
    const categories = await storage.getCategories();
    const updatedCategories = categories.map((c) => (c.id === category.id ? category : c));
    await storage.saveCategories(updatedCategories);
  },
};
