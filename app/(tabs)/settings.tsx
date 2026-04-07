import React, { useState } from 'react';
import { View, Pressable, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { Text } from '@/components/ui/text';
import { useSession } from '@/hooks/useSession';
import { useFinance } from '@/context/FinanceContext';
import { COLORS } from '@/lib/colors';
import { BRICOLAGE } from '@/lib/fonts';
import CategoryGrid from '@/components/categories/CategoryGrid';
import AddCategoryForm from '@/components/categories/AddCategoryForm';
import ThemeToggle from '@/components/common/ThemeToggle';
import SegmentedControl from '@/components/common/SegmentedControl';
import CategoryTransactionsPanel from '@/components/settings/CategoryTransactionsPanel';
import { LogOut, Sun, Moon } from 'lucide-react-native';
import type { Category } from '@/types/finance';

const CAT_TYPE_TABS = [
  { key: 'expense', label: 'Expense' },
  { key: 'income', label: 'Income' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { signOut } = useSession();
  const { categories, transactions, addCategory } = useFinance();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addCategoryType, setAddCategoryType] = useState<'income' | 'expense'>('expense');

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  if (selectedCategory) {
    return (
      <CategoryTransactionsPanel
        category={selectedCategory}
        transactions={transactions}
        onClose={() => setSelectedCategory(null)}
        isDark={isDark}
      />
    );
  }

  if (showAddCategory) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-foreground text-lg font-bold">
            New Category
          </Text>
          <Pressable onPress={() => setShowAddCategory(false)} hitSlop={8}>
            <Text
              style={{
                color: isDark ? COLORS.brand.dark.primary : COLORS.brand.light.primary,
                fontFamily: BRICOLAGE.semiBold,
                fontWeight: '400',
                fontSize: 14,
              }}
            >
              Cancel
            </Text>
          </Pressable>
        </View>

        <View className="px-4 mb-2">
          <SegmentedControl
            tabs={CAT_TYPE_TABS}
            activeKey={addCategoryType}
            onTabChange={(key) => setAddCategoryType(key as 'income' | 'expense')}
          />
        </View>

        <AddCategoryForm
          categoryType={addCategoryType}
          onSave={(cat) => {
            addCategory(cat);
            setShowAddCategory(false);
          }}
          onCancel={() => setShowAddCategory(false)}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-foreground text-xl font-bold">Settings</Text>
        <ThemeToggle />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="mt-5">
          <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-4 mb-2">
            Appearance
          </Text>
          <Pressable
            onPress={toggleColorScheme}
            className="flex-row items-center gap-3 mx-4 px-4 py-3.5 rounded-2xl"
            style={{
              backgroundColor: isDark
                ? COLORS.surface.dark.tertiary
                : COLORS.surface.light.secondary,
            }}
          >
            {isDark ? (
              <Moon size={20} color={COLORS.text.dark.secondary} />
            ) : (
              <Sun size={20} color={COLORS.text.light.secondary} />
            )}
            <Text className="text-foreground text-sm font-medium flex-1">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Text className="text-muted-foreground text-xs">Tap to toggle</Text>
          </Pressable>
        </View>

        <View className="mt-6">
          <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-4 mb-2">
            Categories
          </Text>
          <Text className="text-muted-foreground text-xs px-4 mb-3">
            Tap to view transactions by category
          </Text>
          <CategoryGrid
            categories={categories}
            transactions={transactions}
            onCategoryPress={(cat) => setSelectedCategory(cat)}
            onAddCategory={() => setShowAddCategory(true)}
          />
        </View>

        <View className="mt-5">
          <Pressable
            onPress={handleSignOut}
            className="flex-row items-center justify-center gap-2 mx-4 py-3.5 rounded-2xl active:opacity-80"
            style={{
              backgroundColor: isDark
                ? 'rgba(239,68,68,0.1)'
                : 'rgba(239,68,68,0.06)',
            }}
          >
            <LogOut size={18} color={isDark ? '#f87171' : '#ef4444'} />
            <Text
              style={{
                color: isDark ? '#f87171' : '#ef4444',
                fontSize: 14,
                fontFamily: BRICOLAGE.semiBold,
                fontWeight: '400',
              }}
            >
              Sign Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
