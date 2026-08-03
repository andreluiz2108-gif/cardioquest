import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Sparkles, ArrowRight, BookOpen, Flame, Compass } from 'lucide-react-native';
import { getLatestRecommendation } from '../../utils/adaptiveEngine';
import { LearningRecommendation } from '../../types/adaptive';

export default function AdaptiveRecommendationCard() {
  const [recomendacao, setRecomendacao] = useState<LearningRecommendation | null>(null);

  useEffect(() => {
    async function fetchRec() {
      const rec = await getLatestRecommendation();
      setRecomendacao(rec);
    }
    fetchRec();
  }, []);

  if (!recomendacao) return null;

  const isReforco = recomendacao.categoria === 'reforco';
  const isDesafio = recomendacao.categoria === 'desafio';

  const getCorBanner = () => {
    if (isReforco) return '#F59E0B'; // Amber
    if (isDesafio) return '#EC4899'; // Pink / Master
    return '#3B82F6'; // Blue
  };

  const corBanner = getCorBanner();
  const genieSprite = require('../../assets/nurse_genie_pixel_art.png');

  return (
    <View style={[styles.cardContainer, { borderColor: `${corBanner}50` }]}>
      <View style={styles.cardHeader}>
        <Image source={genieSprite} style={styles.genieIcon} resizeMode="contain" />
        <View style={styles.headerTextGroup}>
          <View style={styles.badgeRow}>
            <Sparkles size={12} color={corBanner} />
            <Text style={[styles.badgeText, { color: corBanner }]}>
              {isReforco ? 'TRILHA DE REFORÇO' : isDesafio ? 'MODO DESAFIO MASTER' : 'RECOMENDAÇÃO DO GÊNIO'}
            </Text>
          </View>
          <Text style={styles.cardTitle}>{recomendacao.titulo}</Text>
        </View>
      </View>

      <Text style={styles.genieSpeechText}>{recomendacao.dicaGenio}</Text>
      <Text style={styles.cardDesc}>{recomendacao.descricao}</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push(`/prontuario?patientId=${recomendacao.patientIdRecomendado}`)}
        style={[styles.actionButton, { backgroundColor: corBanner }]}
      >
        <Text style={styles.actionButtonText}>
          {isReforco ? 'Iniciar Módulo de Reforço' : isDesafio ? 'Aceitar Desafio Master' : 'Ir para o Leito Recomendado'}
        </Text>
        <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  genieIcon: {
    width: 44,
    height: 44,
    marginRight: 10,
  },
  headerTextGroup: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  genieSpeechText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#93C5FD',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 14,
    lineHeight: 17,
  },
  actionButton: {
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
