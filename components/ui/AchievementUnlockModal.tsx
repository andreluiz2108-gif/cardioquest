import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform
} from 'react-native';
import { Sparkles, Trophy, CheckCircle2, Award } from 'lucide-react-native';
import { MedalhaData } from '../../services/achievementService';

interface AchievementUnlockModalProps {
  conquistas: MedalhaData[];
  visible: boolean;
  onClose: () => void;
}

export default function AchievementUnlockModal({
  conquistas,
  visible,
  onClose
}: AchievementUnlockModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible && conquistas.length > 0) {
      scaleAnim.setValue(0.3);
      opacityAnim.setValue(0);
      rotateAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();

      // Pulso contínuo no ícone de brilho
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible, conquistas]);

  if (!visible || conquistas.length === 0) return null;

  const conquista = conquistas[0];
  const IconComponent = conquista.Icone || Trophy;
  const corTema = conquista.corBase || '#F59E0B';

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.modalCard,
            {
              borderTopColor: corTema,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
            },
          ]}
        >
          {/* Faixa de Glória / Carimbo Dourado */}
          <View style={styles.bannerRow}>
            <View style={styles.conquistaBadge}>
              <Sparkles size={16} color="#F59E0B" />
              <Text style={styles.conquistaBadgeText}>CONQUISTA DESBLOQUEADA!</Text>
              <Sparkles size={16} color="#F59E0B" />
            </View>
          </View>

          {/* Ícone com Círculo de Glória Pulsante */}
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: `${corTema}20`,
                borderColor: corTema,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <IconComponent size={56} color={corTema} />
          </Animated.View>

          {/* Título e Subtítulo da Honraria */}
          <Text style={styles.modalTitle}>{conquista.titulo}</Text>
          <Text style={styles.modalSub}>{conquista.subtitulo}</Text>

          {/* Card com o Critério Clínico Superado */}
          <View style={styles.criterioBox}>
            <View style={styles.criterioHeader}>
              <Award size={16} color="#1E3A8A" />
              <Text style={styles.criterioHeaderTitle}>MÉRITO CLÍNICO ALCANÇADO</Text>
            </View>
            <Text style={styles.criterioText}>{conquista.criterio}</Text>
          </View>

          {/* Recompensa em XP */}
          <View style={styles.xpRewardBox}>
            <Trophy size={18} color="#854D0E" />
            <Text style={styles.xpRewardText}>+{conquista.xpBonus} XP DE HONRARIA</Text>
          </View>

          {/* Se houver mais de uma conquista na fila */}
          {conquistas.length > 1 ? (
            <Text style={styles.queueNotice}>
              +{conquistas.length - 1} outra(s) conquista(s) desbloqueada(s) nesta etapa!
            </Text>
          ) : null}

          {/* Botão de Reivindicação */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onClose}
            style={[styles.claimButton, { backgroundColor: corTema }]}
          >
            <CheckCircle2 size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.claimButtonText}>Reivindicar Honraria Médica</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.90)', // Dark navy fosco
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    padding: 24,
    borderTopWidth: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  bannerRow: {
    marginBottom: 16,
  },
  conquistaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  conquistaBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.8,
    marginHorizontal: 6,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  criterioBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    width: '100%',
    marginBottom: 14,
  },
  criterioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  criterioHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1E3A8A',
    letterSpacing: 0.6,
    marginLeft: 6,
  },
  criterioText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  xpRewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF9C3',
    borderWidth: 1.5,
    borderColor: '#FDE047',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  xpRewardText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#854D0E',
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  queueNotice: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 12,
    textAlign: 'center',
  },
  claimButton: {
    height: 52,
    width: '100%',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
