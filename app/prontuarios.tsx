import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  User,
  Star,
  Activity,
  ChevronRight,
  ShieldAlert,
  Hospital
} from 'lucide-react-native';
import { getAllPatients } from '../data/patientsData';
import { PatientCase } from '../types/patient';
import MedicalClipboardCard from '../components/ui/MedicalClipboardCard';

export default function GaleriaProntuariosScreen() {
  const [pacientes, setPacientes] = useState<PatientCase[]>([]);
  const [progressoPacientes, setProgressoPacientes] = useState<{ [key: string]: number }>({});

  const carregarProgressoGeral = async () => {
    const todos = getAllPatients();
    setPacientes(todos);

    const progressoMap: { [key: string]: number } = {};

    for (const p of todos) {
      let modConcluidos = 0;
      try {
        const m1 = await AsyncStorage.getItem(`venceu_mod1_paciente_${p.id}`);
        const m2 = await AsyncStorage.getItem(`venceu_mod2_paciente_${p.id}`);
        const m3 = await AsyncStorage.getItem(`venceu_mod3_paciente_${p.id}`);
        const m4 = await AsyncStorage.getItem(`venceu_mod4_paciente_${p.id}`);
        const m5 = await AsyncStorage.getItem(`venceu_mod5_paciente_${p.id}`);
        const m6 = await AsyncStorage.getItem(`venceu_mod6_paciente_${p.id}`);

        if (p.id === 'carlos' && !m1) {
          const m1Old = await AsyncStorage.getItem('venceu_mod1');
          const m2Old = await AsyncStorage.getItem('venceu_mod2');
          const m3Old = await AsyncStorage.getItem('venceu_mod3');
          const m4Old = await AsyncStorage.getItem('venceu_mod4');
          const m5Old = await AsyncStorage.getItem('venceu_mod5');
          if (m1Old === 'true') modConcluidos++;
          if (m2Old === 'true') modConcluidos++;
          if (m3Old === 'true') modConcluidos++;
          if (m4Old === 'true') modConcluidos++;
          if (m5Old === 'true') modConcluidos++;
        } else {
          if (m1 === 'true') modConcluidos++;
          if (m2 === 'true') modConcluidos++;
          if (m3 === 'true') modConcluidos++;
          if (m4 === 'true') modConcluidos++;
          if (m5 === 'true') modConcluidos++;
          if (m6 === 'true') modConcluidos++;
        }
      } catch (e) {
        console.error(e);
      }
      progressoMap[p.id] = Math.round((modConcluidos / 6) * 100);
    }

    setProgressoPacientes(progressoMap);
  };

  useFocusEffect(
    useCallback(() => {
      carregarProgressoGeral();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>SALA VERMELHA • LEITOS DE EMERGÊNCIA</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.introCard}>
          <View style={styles.introHeaderRow}>
            <Hospital color="#38BDF8" size={22} />
            <Text style={styles.introTitle}>CTI / Sala de Emergência Coronariana</Text>
          </View>
          <Text style={styles.introDesc}>
            Selecione um dos leitos abaixo para assumir o atendimento de emergência do paciente e executar os 6 módulos clínicos.
          </Text>
        </View>

        {pacientes.map((paciente, idx) => {
          const progresso = progressoPacientes[paciente.id] || 0;
          const leitoNum = `0${idx + 1}`;

          return (
            <TouchableOpacity
              key={paciente.id}
              activeOpacity={0.9}
              onPress={() => router.push(`/prontuario?patientId=${paciente.id}`)}
            >
              <MedicalClipboardCard
                titulo={`LEITO ${leitoNum} — FICHA DE ADMISSÃO`}
                classificacao={paciente.triagem.classificacaoEsperada}
                corTag={paciente.corDestaque}
                complexidade={paciente.complexidade}
              >
                <View style={styles.patientHeader}>
                  <View style={styles.avatarCircle}>
                    <User color="#1E3A8A" size={24} />
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{paciente.nome}</Text>
                    <Text style={styles.patientSub}>
                      {paciente.idade} anos • {paciente.genero} • {paciente.ocupacao}
                    </Text>
                  </View>
                  <ChevronRight color="#94A3B8" size={24} />
                </View>

                <View style={styles.divider} />

                <Text style={styles.queixaText} numberOfLines={2}>
                  💬 "{paciente.queixaPrincipal}"
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.badgeDiag}>
                    <ShieldAlert color="#EF4444" size={13} />
                    <Text style={styles.badgeDiagText}>{paciente.ecg.paredeAtingida}</Text>
                  </View>

                  <View style={styles.progressContainer}>
                    <Activity color="#2563EB" size={14} />
                    <Text style={styles.progressText}>{progresso}% Atendido</Text>
                  </View>
                </View>
              </MedicalClipboardCard>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  appBar: {
    height: 56,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  iconButton: {
    padding: 12,
  },
  appBarTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  container: {
    padding: 20,
  },
  introCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  introHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginLeft: 8,
  },
  introDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  queixaText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#334155',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeDiag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  badgeDiagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#DC2626',
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
    marginLeft: 4,
  },
});
