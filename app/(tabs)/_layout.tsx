import { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, StyleSheet } from 'react-native';
import type { ThemeColors } from '../../src/constants/colors';
import { useTheme } from '../../src/providers/ThemeProvider';
import { useAuth } from '../../src/providers/AuthProvider';
import type { IoniconName } from '../../src/types/icons';
import { useNotificationSetup, useReminderSync } from '../../src/hooks/useNotifications';

function TabIcon({ name, focused }: { name: IoniconName; color: string; focused: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={name} size={22} color={focused ? colors.white : colors.textLight} />
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { isVeterinario } = useAuth();
  useNotificationSetup();
  useReminderSync();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 20,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Pets',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'paw' : 'paw-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Lembretes',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'notifications' : 'notifications-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          title: 'Consulta',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'medical' : 'medical-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          href: isVeterinario ? null : undefined,
          title: 'Chat IA',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          href: isVeterinario ? undefined : null,
          title: 'Clínica',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'person-circle' : 'person-circle-outline'} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  iconWrap: {
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
    width: 48,
    height: 30,
    borderRadius: 15,
  },
});
