import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../providers/ThemeProvider';

interface GradientHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  colors?: string[];
}

// Cabecalho roxo em gradiente usado no topo das telas; segue o tema por padrao.
export const GradientHeader: React.FC<GradientHeaderProps> = ({ children, style, colors }) => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={colors ?? [theme.colors.gradientEnd, theme.colors.gradientStart]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};
