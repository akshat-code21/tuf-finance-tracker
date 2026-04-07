import { useEffect, useState } from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from '@expo-google-fonts/bricolage-grotesque';
import { Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import { COLORS } from '@/lib/colors';
import { BRICOLAGE, BRICOLAGE_FONT_MAP } from '@/lib/fonts';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const tab = isDark ? COLORS.tabBar.dark : COLORS.tabBar.light;

  const [fontsLoaded] = useFonts(BRICOLAGE_FONT_MAP);
  const [tabNavRemountKey, setTabNavRemountKey] = useState(0);

  useEffect(() => {
    if (!fontsLoaded) return;
    let cancelled = false;
    let innerFrame: number | undefined;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        if (!cancelled) {
          setTabNavRemountKey((k) => k + 1);
        }
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(outerFrame);
      if (innerFrame !== undefined) cancelAnimationFrame(innerFrame);
    };
  }, [fontsLoaded]);

  return (
    <NativeTabs
      key={tabNavRemountKey}
      backgroundColor={tab.bg}
      iconColor={{ default: tab.inactive, selected: tab.active }}
      labelStyle={{
        default: {
          color: tab.inactive,
          fontSize: 11,
          fontFamily: BRICOLAGE.regular,
          fontWeight: '400',
        },
        selected: {
          color: tab.active,
          fontSize: 11,
          fontFamily: BRICOLAGE.semiBold,
          fontWeight: '400',
        },
      }}
      tintColor={tab.active}
      labelVisibilityMode={Platform.OS === 'android' ? 'labeled' : undefined}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="home" />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="transactions">
        <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="receipt-long" />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="summary">
        <NativeTabs.Trigger.Label>Summary</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="pie-chart" />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="settings" />}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
