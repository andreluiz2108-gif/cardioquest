import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Clipboard, ShieldAlert, Star } from 'lucide-react-native';

interface MedicalClipboardCardProps {
  children: React.ReactNode;
  titulo?: string;
  classificacao?: string;
  corTag?: string;
  complexidade?: number;
  style?: ViewStyle;
}

export default function MedicalClipboardCard({
  children,
  titulo = 'PRONTUÁRIO MÉDICO DE LEITO',
  classificacao,
  corTag = '#EF4444',
  complexidade,
  style
}: MedicalClipboardCardProps) {
  return (
    <View style={[styles.clipboardContainer, style]}>
      {/* Clipe Metálico Superior */}
      <View style={styles.metallicClip}>
        <View style={styles.metallicHole} />
      </View>

      {/* Papel do Prontuário */}
      <View style={styles.paperSheet}>
        {/* Header do Documento Médico */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleGroup}>
            <Clipboard size={16} color="#1E3A8A" />
            <Text style={styles.headerTitle}>{titulo}</Text>
          </View>

          {classificacao ? (
            <View style={[styles.urgencyTag, { backgroundColor: corTag }]}>
              <Text style={styles.urgencyTagText}>{classificacao.toUpperCase()}</Text>
            </View>
          ) : null}

          {complexidade ? (
            <View style={styles.starsGroup}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  color={i < complexidade ? '#EAB308' : '#CBD5E1'}
                  fill={i < complexidade ? '#EAB308' : 'transparent'}
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
    backgroundColor: '#334155', // Prancha escura de suporte
    borderRadius: 20,
    paddingTop: 18,
    paddingHorizontal: 10,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  metallicClip: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 100,
    height: 24,
    backgroundColor: '#94A3B8', // Efeito metálico cromado
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  metallicHole: {
    width: 30,
    height: 6,
    backgroundColor: '#475569',
    borderRadius: 3,
  },
  paperSheet: {
    backgroundColor: '#FFFFFF', // Papel clínico claro
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#1E3A8A',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  urgencyTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgencyTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  starsGroup: {
    flexDirection: 'row',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
});
