import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import {
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Activity,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react-native';

interface ClinicalFeedbackOverlayProps {
  visible: boolean;
  variant: 'success' | 'warning' | 'completion';
  titulo: string;
  mensagem: string;
  explicacaoMedica?: string;
  xpGanhos?: number;
  textoBotao?: string;
  onConfirm: () => void;
}

export default function ClinicalFeedbackOverlay({
  visible,
  variant,
  titulo,
  mensagem,
  explicacaoMedica,
  xpGanhos,
  textoBotao,
  onConfirm
}: ClinicalFeedbackOverlayProps) {
  if (!visible) return null;

  const isSuccess = variant === 'success';
  const isCompletion = variant === 'completion';
  const isWarning = variant === 'warning';

  const getCorTema = () => {
    if (isCompletion) return '#10B981'; // Emerald
    if (isSuccess) return '#22C55E'; // Green
    return '#EF4444'; // Red
  };

  const getCarimboTexto = () => {
    if (isCompletion) return 'PRONTUÁRIO CONCLUÍDO';
    if (isSuccess) return 'CONDUTA APROVADA';
    return 'ALERTA CLÍNICO';
  };

  const corTema = getCorTema();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, { borderTopColor: corTema }]}>
          {/* Header de Carimbo Clínico */}
          <View style={styles.headerRow}>
            <View style={[styles.carimboBadge, { borderColor: corTema }]}>
              <Text style={[styles.carimboText, { color: corTema }]}>
                {getCarimboTexto()}
              </Text>
            </View>

            {xpGanhos ? (
              <View style={styles.xpBadge}>
                <Trophy size={14} color="#EAB308" />
                <Text style={styles.xpBadgeText}>+{xpGanhos} XP</Text>
              </View>
            ) : null}
          </View>

          {/* Ícone Central */}
          <View style={[styles.iconCircle, { backgroundColor: `${corTema}15` }]}>
            {isCompletion ? (
              <Trophy size={42} color={corTema} />
            ) : isSuccess ? (
              <CheckCircle2 size={42} color={corTema} />
            ) : (
              <AlertTriangle size={42} color={corTema} />
            )}
          </View>

          {/* Títulos e Mensagem Principal */}
          <Text style={styles.modalTitle}>{titulo}</Text>
          <Text style={styles.modalMessage}>{mensagem}</Text>

          {/* Card de Debriefing / Fundamentação Médica */}
          {explicacaoMedica ? (
            <View style={styles.debriefingCard}>
              <View style={styles.debriefingHeader}>
                <ShieldCheck size={16} color="#1E3A8A" />
                <Text style={styles.debriefingTitle}>Fundamentação Médica</Text>
              </View>
              <Text style={styles.debriefingText}>{explicacaoMedica}</Text>
            </View>
          ) : null}

          {/* Botão de Ação Terapêutica */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onConfirm}
            style={[styles.actionButton, { backgroundColor: corTema }]}
          >
            {isWarning ? (
              <RotateCcw size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            ) : (
              <ArrowRight size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            )}
            <Text style={styles.actionButtonText}>
              {textoBotao || (isWarning ? 'Revisar Conduta' : 'Continuar Atendimento')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // Dark navy semitransparente
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  carimboBadge: {
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    transform: [{ rotate: '-2deg' }],
  },
  carimboText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  xpBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#854D0E',
    marginLeft: 4,
  },
  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  debriefingCard: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  debriefingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  debriefingTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginLeft: 6,
  },
  debriefingText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  actionButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
