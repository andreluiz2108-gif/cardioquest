import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Hospital, ShieldCheck, QrCode } from 'lucide-react-native';

interface HospitalBadgeCardProps {
  nome: string;
  cargo: string;
  avatarEmoji: string;
  xpTotal: number;
  hospital?: string;
  corCargo?: string;
}

export default function HospitalBadgeCard({
  nome,
  cargo,
  avatarEmoji,
  xpTotal,
  hospital = 'HOSPITAL DAS CLÍNICAS — UNICAMP',
  corCargo = '#10B981'
}: HospitalBadgeCardProps) {
  return (
    <View style={styles.badgeContainer}>
      {/* Cordão do Crachá */}
      <View style={styles.lanyardLoop} />

      {/* Cartão do Crachá */}
      <View style={styles.badgeCard}>
        {/* Topo do Crachá com Branding do Hospital */}
        <View style={styles.badgeHeader}>
          <Hospital size={18} color="#FFFFFF" />
          <Text style={styles.hospitalText}>{hospital}</Text>
        </View>

        {/* Corpo do Crachá */}
        <View style={styles.badgeBody}>
          {/* Foto/Avatar com Moldura Gamificada */}
          <View style={styles.photoContainer}>
            <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
          </View>

          {/* Dados do Profissional */}
          <View style={styles.infoContainer}>
            <Text style={styles.nomeText} numberOfLines={1}>
              {nome || 'Dr(a). Plantonista'}
            </Text>

            <View style={[styles.roleBadge, { backgroundColor: '#3B0764', borderColor: corCargo }]}>
              <ShieldCheck size={13} color={corCargo} />
              <Text style={[styles.roleBadgeText, { color: corCargo }]}>{cargo}</Text>
            </View>

            <View style={styles.xpRow}>
              <Text style={styles.xpText}>⭐ {xpTotal} XP Acumulados</Text>
            </View>
          </View>

          {/* QR Code / Chip Hospitalar */}
          <View style={styles.qrBox}>
            <QrCode size={30} color="#7C3AED" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lanyardLoop: {
    width: 60,
    height: 12,
    backgroundColor: '#7C3AED',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: -2,
    zIndex: 1,
  },
  badgeCard: {
    backgroundColor: '#3B0764',
    width: '100%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6D28D9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  badgeHeader: {
    backgroundColor: '#581C87',
    paddingVertical: 9,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6D28D9',
  },
  hospitalText: {
    color: '#F5F3FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  badgeBody: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E1065',
  },
  photoContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#4C1D95',
    borderWidth: 2.5,
    borderColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 34,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  nomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    marginTop: 4,
    marginBottom: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 4,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 12,
    color: '#FBBF24',
    fontWeight: '700',
  },
  qrBox: {
    padding: 6,
    backgroundColor: '#3B0764',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#6D28D9',
  },
});
