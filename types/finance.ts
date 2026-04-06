export type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  date: Date;
  note: string;
};

export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  isCustom?: boolean;
};

export type FinanceState = {
  transactions: Transaction[];
  categories: Category[];
  hydrated: boolean;
};
