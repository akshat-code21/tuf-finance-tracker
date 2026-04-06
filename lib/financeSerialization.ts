import type { Category, Transaction } from '@/types/finance';

export function parseStoredTransaction(raw: unknown): Transaction {
  const o = raw as Record<string, unknown>;
  const dateVal = o.date;
  const date =
    dateVal instanceof Date ? dateVal : new Date(typeof dateVal === 'string' ? dateVal : String(dateVal));
  return {
    id: String(o.id),
    amount: Number(o.amount),
    type: o.type === 'expense' ? 'expense' : 'income',
    categoryId: String(o.categoryId ?? ''),
    date,
    note: String(o.note ?? ''),
  };
}

export function parseStoredCategory(raw: unknown): Category {
  const o = raw as Record<string, unknown>;
  return {
    id: String(o.id),
    name: String(o.name),
    type: o.type === 'expense' ? 'expense' : 'income',
    icon: String(o.icon),
    color: String(o.color),
    isCustom: o.isCustom === true,
  };
}
