import React, { useMemo, useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/hooks/useSession';
import { useFinance } from '@/context/FinanceContext';
import { getMonthBounds, filterTransactionsByMonth, getMonthlySummary } from '@/lib/financeSelectors';
import { formatMonthYear } from '@/lib/formatters';

import GreetingHeader from '@/components/dashboard/GreetingCard';
import BalanceCard from '@/components/dashboard/BalanceCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import FAB from '@/components/common/FAB';
import ThemeToggle from '@/components/common/ThemeToggle';
import AddTransactionFullscreen from '@/components/transactions/AddTransactionFullscreen';

import type { Transaction } from '@/types/finance';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { displayName } = useSession();
  const { transactions, categories, hydrated, addTransaction } = useFinance();

  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const now = useMemo(() => new Date(), []);
  const monthBounds = useMemo(() => getMonthBounds(now), [now]);
  const monthlyTxns = useMemo(
    () => filterTransactionsByMonth(transactions, monthBounds),
    [transactions, monthBounds]
  );
  const summary = useMemo(() => getMonthlySummary(monthlyTxns), [monthlyTxns]);
  const monthLabel = useMemo(() => formatMonthYear(now), [now]);

  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleSaveTransaction = (tx: Transaction) => {
    addTransaction(tx);
    setShowAddTransaction(false);
  };

  if (showAddTransaction) {
    return (
      <AddTransactionFullscreen
        categories={categories}
        onSave={handleSaveTransaction}
        onClose={() => setShowAddTransaction(false)}
      />
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View
        className="absolute z-10 flex-row justify-end"
        style={{
          top: insets.top + 8,
          right: Math.max(insets.right, 16),
        }}
        pointerEvents="box-none"
      >
        <ThemeToggle />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: 100,
        }}
      >
        <GreetingHeader userName={displayName.trim() || 'User'} />
        <View className="px-4 mt-3">
          <BalanceCard
            periodLabel={monthLabel}
            balance={summary.remainingBalance}
            income={summary.totalIncome}
            expenses={summary.totalExpenses}
          />
        </View>
        <View className="mt-6">
          <RecentTransactions
            transactions={transactions.slice(0,4)}
            categories={categories}
            onSeeAll={() => router.push('/(tabs)/transactions')}
            onTransactionPress={() => router.push('/(tabs)/transactions')}
            onAddTransaction={() => setShowAddTransaction(true)}
          />
        </View>
      </ScrollView>
      <FAB onPress={() => setShowAddTransaction(true)} />
    </View>
  );
}
