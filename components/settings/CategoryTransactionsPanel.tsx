import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Pressable,
  ScrollView,
  BackHandler,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import TransactionRow from '@/components/transactions/TransactionRow';
import { ArrowLeft } from 'lucide-react-native';
import type { Category, Transaction } from '@/types/finance';

type Props = {
  category: Category;
  transactions: Transaction[];
  onClose: () => void;
  isDark: boolean;
};

const ENTER_MS = 320;
const EXIT_MS = 280;
const EDGE_WIDTH = 40;

export default function CategoryTransactionsPanel({
  category,
  transactions,
  onClose,
  isDark,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const translateX = useSharedValue(Math.max(windowWidth, 1));

  const filtered = useMemo(
    () => transactions.filter((t) => t.categoryId === category.id),
    [transactions, category.id]
  );

  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [filtered]
  );

  const finishClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const animateOut = useCallback(() => {
    translateX.value = withTiming(
      windowWidth,
      {
        duration: EXIT_MS,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) runOnJS(finishClose)();
      }
    );
  }, [finishClose, translateX, windowWidth]);

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: ENTER_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      animateOut();
      return true;
    });
    return () => sub.remove();
  }, [animateOut]);

  const animatedRoot = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const edgePan = useMemo(() => {
    const w = windowWidth;
    return Gesture.Pan()
      .activeOffsetX(8)
      .failOffsetY([-32, 32])
      .onUpdate((e) => {
        const drag = Math.max(0, e.translationX);
        translateX.value = Math.min(drag, w);
      })
      .onEnd((e) => {
        const x = translateX.value;
        const shouldClose = x > w * 0.2 || e.velocityX > 650;
        if (shouldClose) {
          translateX.value = withTiming(
            w,
            { duration: 240, easing: Easing.in(Easing.cubic) },
            (finished) => {
              if (finished) runOnJS(finishClose)();
            }
          );
        } else {
          translateX.value = withSpring(0, {
            damping: 28,
            stiffness: 260,
            mass: 0.85,
          });
        }
      });
  }, [finishClose, translateX, windowWidth]);

  const arrowColor = isDark ? '#e2e8f0' : '#1e293b';

  return (
    <View className="flex-1 bg-background">
      <Animated.View
        className="flex-1 bg-background"
        style={[{ paddingTop: insets.top }, animatedRoot]}
      >
        {Platform.OS !== 'web' && (
          <GestureDetector gesture={edgePan}>
            <View
              pointerEvents="box-only"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: EDGE_WIDTH,
                zIndex: 50,
              }}
              accessibilityLabel="Swipe from the left edge to go back"
            />
          </GestureDetector>
        )}

        <View className="flex-row items-center gap-3 px-4 py-3">
          <Pressable onPress={animateOut} hitSlop={12}>
            <ArrowLeft size={22} color={arrowColor} />
          </Pressable>
          <Text className="text-foreground text-lg font-bold flex-1">
            {category.name}
          </Text>
          <Text className="text-muted-foreground text-sm">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {filtered.length === 0 ? (
            <View className="py-16 items-center">
              <Text className="text-muted-foreground text-sm text-center">
                No transactions in this category yet
              </Text>
            </View>
          ) : (
            sorted.map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                category={category}
              />
            ))
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
