import React, { useEffect, useMemo } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QueryProvider } from '../src/providers/QueryProvider';
import { AuthProvider, useAuth } from '../src/providers/AuthProvider';
import { LoadingState } from '../src/components/StateViews';
import type { ThemeColors } from '../src/constants/colors';
import { ThemeProvider, useTheme } from '../src/providers/ThemeProvider';

function RootNavigator() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/onboarding');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingSafe}>
        <View style={styles.loadingBox}>
          <LoadingState label="Restaurando sessão..." />
        </View>
      </SafeAreaView>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  loadingSafe: { flex: 1, backgroundColor: colors.surface },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
