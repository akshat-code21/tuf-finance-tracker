import '@/global.css';
import 'react-native-gesture-handler';

import { FinanceProvider } from '@/context/FinanceContext';
import { SessionProvider } from '@/context/SessionContext';
import { NAV_THEME } from '@/lib/theme';
import { useFonts } from '@expo-google-fonts/bricolage-grotesque';
import { BRICOLAGE_FONT_MAP } from '@/lib/fonts';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const [loaded, error] = useFonts(BRICOLAGE_FONT_MAP);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 font-sans">
        <SessionProvider>
          <FinanceProvider>
            <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
              <PortalHost />
            </ThemeProvider>
          </FinanceProvider>
        </SessionProvider>
      </View>
    </GestureHandlerRootView>
  );
}
