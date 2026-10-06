import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  Platform
} from 'react-native';
import { Sparkles, X, HelpCircle, Lightbulb } from 'lucide-react-native';

interface NurseGenieAvatarProps {
  dicaTexto: string;
  onDicaSolicitada?: () => void;
  posicao?: 'bottom-right' | 'inline';
}

export default function NurseGenieAvatar({
  dicaTexto,
  onDicaSolicitada,
  posicao = 'bottom-right'
}: NurseGenieAvatarProps) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dicaJaVista, setDicaJaVista] = useState(false);

  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [floatAnim]);

  const abrirDica = () => {
    setModalVisivel(true);
    if (!dicaJaVista && onDicaSolicitada) {
      onDicaSolicitada();
      setDicaJaVista(true);
    }
  };

  const genieImageSource = require('../../assets/nurse_genie_pixel_art.png');

  return (
    <>
      {/* Sprite Flutuante do Gênio no Canto Inferior Direito */}
      <Animated.View
        style={[
          styles.containerFloating,
          { transform: [{ translateY: floatAnim }] }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={abrirDica}
          style={styles.spriteButton}
        >
          {/* Badge Indicador de Dica Disponível */}
          <View style={styles.hintIndicatorBadge}>
            <Sparkles size={12} color="#FFFFFF" />
            <Text style={styles.hintIndicatorText}>Dica</Text>
          </View>

          {/* Sprite do Gênio Enfermeiro em Pixel Art */}
          <Image
            source={genieImageSource}
            style={styles.genieSprite}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Modal / Balão de Fala com a Dica Médica do Gênio */}
      <Modal
        transparent
        visible={modalVisivel}
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.speechBubbleCard}>
            <View style={styles.bubbleHeader}>
              <View style={styles.titleGroup}>
                <Lightbulb size={20} color="#F59E0B" />
                <Text style={styles.bubbleTitle}>Dica Clínica do Gênio Enfermeiro</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisivel(false)} style={styles.closeButton}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.genieRow}>
              <Image
                source={genieImageSource}
                style={styles.modalGenieSprite}
                resizeMode="contain"
              />
              <View style={styles.bubbleContent}>
                <Text style={styles.dicaText}>{dicaTexto}</Text>
              </View>
            </View>

            <View style={styles.warningNote}>
              <HelpCircle size={14} color="#7C3AED" />
              <Text style={styles.warningNoteText}>
                Pedir dicas mágicas ajuda na retenção, mas reduz ligeiramente a pontuação final de maestria do caso.
              </Text>
            </View>

            {/* Botão 3D Gamificado */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setModalVisivel(false)}
              style={styles.entendiButton3D}
            >
              <Text style={styles.entendiButtonText}>ENTENDI, OBRIGADO GÊNIO!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  containerFloating: {
    position: 'absolute',
    bottom: 24,
    right: 18,
    zIndex: 99,
  },
  spriteButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 2,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  hintIndicatorText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 3,
  },
  genieSprite: {
    width: 68,
    height: 68,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(46, 16, 101, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  speechBubbleCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 20,
    borderWidth: 2.5,
    borderColor: '#C4B5FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FE',
    paddingBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubbleTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#4C1D95',
    marginLeft: 6,
  },
  closeButton: {
    padding: 4,
  },
  genieRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalGenieSprite: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  bubbleContent: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
  },
  dicaText: {
    fontSize: 13,
    color: '#3B0764',
    lineHeight: 19,
    fontWeight: '600',
  },
  warningNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    padding: 8,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  warningNoteText: {
    fontSize: 11,
    color: '#6B21A8',
    marginLeft: 6,
    flex: 1,
  },
  entendiButton3D: {
    backgroundColor: '#10B981',
    height: 48,
    borderRadius: 14,
    borderBottomWidth: 4,
    borderBottomColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
  },
  entendiButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
