import React from 'react';
import { RefreshControl, type RefreshControlProps } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

type ThemedRefreshControlProps = Omit<RefreshControlProps, 'colors' | 'tintColor'>;

// Pull-to-refresh com a cor do tema; usado em todas as telas com rolagem.
// No Android o ScrollView clona este elemento e passa a si mesmo como filho (e o style),
// por isso todas as props precisam ser repassadas ao RefreshControl.
export const ThemedRefreshControl: React.FC<ThemedRefreshControlProps> = (props) => {
  const { colors } = useTheme();

  return <RefreshControl {...props} colors={[colors.primary]} tintColor={colors.primary} />;
};
