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
  corCargo = '#3B82F6'
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
          {/* Foto/Avatar com Moldura */}
          <View style={styles.photoContainer}>
            <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
          </View>

          {/* Dados do Profissional */}
          <View style={styles.infoContainer}>
            <Text style={styles.nomeText} numberOfLines={1}>
              {nome || 'Dr(a). Plantonista'}
            </Text>

            <View style={[styles.roleBadge, { backgroundColor: `${corCargo}20`, borderColor: corCargo }]}>
              <ShieldCheck size={12} color={corCargo} />
              <Text style={[styles.roleBadgeText, { color: corCargo }]}>{cargo}</Text>
            </View>

            <Text style={styles.xpText}>⭐ {xpTotal} XP Acumulados</Text>
          </View>

          {/* QR Code / Chip Hospitalar */}
          <View style={styles.qrBox}>
            <QrCode size={32} color="#475569" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lanyardLoop: {
    width: 60,
    height: 12,
    backgroundColor: '#1E3A8A',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: -2,
    zIndex: 1,
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  badgeHeader: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  badgeBody: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#94A3B8',
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
    color: '#0F172A',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  xpText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  qrBox: {
    padding: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
