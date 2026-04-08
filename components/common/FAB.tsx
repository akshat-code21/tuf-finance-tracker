import React from 'react';
import { Platform, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/lib/colors';
import { useColorScheme } from 'nativewind';

const TAB_BAR_OFFSET = Platform.select({ ios: 23, android: 23, default: 23 });

type Props = {
  onPress: () => void;
};

export default function FAB({ onPress }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add transaction"
      hitSlop={8}
      className="absolute right-5 z-50 h-14 w-14 items-center justify-center rounded-full"
      style={{
        bottom: Math.max(insets.bottom, 12) + TAB_BAR_OFFSET + 8,
        backgroundColor: isDark
          ? COLORS.brand.dark.primary
          : COLORS.brand.light.primary,
        shadowColor: isDark
          ? COLORS.brand.dark.primary
          : COLORS.brand.light.primary,
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }}
    >
      <Plus size={28} color="#fff" strokeWidth={2.5} />
    </Pressable>
  );
}
