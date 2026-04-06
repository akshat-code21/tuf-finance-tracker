import type { Category } from '@/types/finance';

export const DEFAULT_CATEGORIES = {
  income: [
    {
      id: 'inc-1',
      name: 'Salary',
      type: 'income' as const,
      icon: 'wallet',
      color: 'green',
    },
    {
      id: 'inc-2',
      name: 'Freelance',
      type: 'income' as const,
      icon: 'receipt',
      color: 'blue',
    },
    {
      id: 'inc-3',
      name: 'Investments',
      type: 'income' as const,
      icon: 'dollar-sign',
      color: 'green',
    },
  ],
  expense: [
    {
      id: 'exp-1',
      name: 'Food',
      type: 'expense' as const,
      icon: 'utensils',
      color: 'red',
    },
    {
      id: 'exp-2',
      name: 'Transport',
      type: 'expense' as const,
      icon: 'car-front',
      color: 'blue',
    },
    {
      id: 'exp-3',
      name: 'Housing',
      type: 'expense' as const,
      icon: 'house',
      color: 'yellow',
    },
    {
      id: 'exp-4',
      name: 'Utilities',
      type: 'expense' as const,
      icon: 'lightbulb',
      color: 'purple',
    },
    {
      id: 'exp-5',
      name: 'Entertainment',
      type: 'expense' as const,
      icon: 'film',
      color: 'orange',
    },
  ],
} as const;

export const SEED_CATEGORIES: Category[] = [
  ...DEFAULT_CATEGORIES.income.map((c) => ({ ...c })),
  ...DEFAULT_CATEGORIES.expense.map((c) => ({ ...c })),
];
