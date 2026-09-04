import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Clipboard, Star } from 'lucide-react-native';

interface MedicalClipboardCardProps {
  children: React.ReactNode;
  titulo?: string;
  complexidade?: number;
  style?: ViewStyle;
}

export default function MedicalClipboardCard({
  children,
  titulo = 'PRONTUÁRIO MÉDICO DE LEITO',
  complexidade,
  style
}: MedicalClipboardCardProps) {
  return (
    <View style={[styles.clipboardContainer, style]}>
      {/* Clipe Superior Gamificado */}
      <View style={styles.metallicClip}>
        <View style={styles.metallicHole} />
      </View>

      {/* Papel do Prontuário */}
      <View style={styles.paperSheet}>
        {/* Header do Documento Médico */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleGroup}>
            <Clipboard size={16} color="#6D28D9" />
            <Text style={styles.headerTitle}>{titulo}</Text>
          </View>

          {/* Dificuldade indicada exclusivamente por estrelas douradas */}
          {complexidade ? (
            <View style={styles.starsGroup}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  color={i < complexidade ? '#F59E0B' : '#E2E8F0'}
                  fill={i < complexidade ? '#F59E0B' : 'transparent'}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.divider} />

        {/* Conteúdo Clínico da Ficha */}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clipboardContainer: {
    backgroundColor: '#3B0764', // Prancha em tom roxo profundo
    borderRadius: 22,
    paddingTop: 18,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderWidth: 2,
    borderColor: '#581C87',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 20,
  },
  metallicClip: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 100,
    height: 24,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  metallicHole: {
    width: 32,
    height: 6,
    backgroundColor: '#4C1D95',
    borderRadius: 3,
  },
  paperSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EDE9FE',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#4C1D95',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  starsGroup: {
    flexDirection: 'row',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDE9FE',
    marginVertical: 10,
  },
});
