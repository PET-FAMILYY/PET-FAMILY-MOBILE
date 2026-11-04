import React from 'react';
import { RefreshControl } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

interface ThemedRefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;
}

// Pull-to-refresh com a cor do tema; usado em todas as telas com rolagem.
export const ThemedRefreshControl: React.FC<ThemedRefreshControlProps> = ({ refreshing, onRefresh }) => {
  const { colors } = useTheme();

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.primary]}
      tintColor={colors.primary}
    />
  );
};
