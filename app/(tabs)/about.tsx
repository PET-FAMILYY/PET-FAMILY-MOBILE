import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AccountCard } from '../../src/components/about/AccountCard';
import { AppearanceCard } from '../../src/components/about/AppearanceCard';
import { AppInfoCard } from '../../src/components/about/AppInfoCard';
import { NotificationsCard } from '../../src/components/about/NotificationsCard';
import { ProjectInfo } from '../../src/components/about/ProjectInfo';
import { TeamSection } from '../../src/components/about/TeamSection';
import { AboutFooter } from '../../src/components/about/AboutFooter';
import type { ThemeColors } from '../../src/constants/colors';
import { useTheme } from '../../src/providers/ThemeProvider';

export default function AboutScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradientEnd} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.gradientEnd, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.heroTitle}>Pet Family</Text>
          <Text style={styles.heroSub}>
            Cuidado contínuo, preventivo e personalizado para pets.
          </Text>

          <View style={styles.heroBadge}>
            <Ionicons name="school" size={15} color={colors.white} />
            <Text style={styles.heroBadgeText}>Challenge CLYVO VET 2026</Text>
          </View>
        </LinearGradient>

        <View style={styles.sheet}>
          <AccountCard />
          <AppearanceCard />
          <NotificationsCard />
          <AppInfoCard />
          <ProjectInfo />
          <TeamSection />
          <AboutFooter />

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.gradientEnd,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 0,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 52,
  },
  logoCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  logo: {
    width: 116,
    height: 116,
  },
  heroTitle: {
    fontSize: 31,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.3,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.84)',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 310,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  heroBadgeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '800',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -26,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  bottomPad: {
    height: 30,
  },
});
