import { StyleSheet } from 'react-native';
import type { ThemeColors } from '../../constants/colors';

// Estilos de casca (area segura, cabecalho e rolagem) compartilhados pelas duas visoes de consultas.
export const createConsultasBaseStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gradientEnd },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },

  headerGrad: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  bottomPad: { height: 28 },
});
