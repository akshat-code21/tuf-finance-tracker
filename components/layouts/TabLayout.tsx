import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { MaterialIcons } from "@expo/vector-icons"
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const muted = isDark ? '#a3a3a3' : '#737373';
    const foreground = isDark ? '#fafafa' : '#171717';
    return (
        <NativeTabs
            backgroundColor={isDark ? '#0a0a0a' : '#ffffff'}
            iconColor={{ default: muted, selected: foreground }}
            labelStyle={{
                default: { color: muted },
                selected: { color: foreground },
            }}
            tintColor={foreground}>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="home" />} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="settings">
                <NativeTabs.Trigger.Icon src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="settings" />} />
                <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
