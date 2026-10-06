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
  Activity,
  ChevronRight,
  ShieldAlert,
  Hospital,
  Play
} from 'lucide-react-native';
import { getAllPatients } from '../data/patientsData';
import { PatientCase } from '../types/patient';
import MedicalClipboardCard from '../components/ui/MedicalClipboardCard';

export default function GaleriaProntuariosScreen() {
  const [pacientes, setPacientes] = useState<PatientCase[]>([]);
  const [progressoPacientes, setProgressoPacientes] = useState<{ [key: string]: number }>({});
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'andamento' | 'concluidos'>('todos');

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

  const pacientesFiltrados = pacientes.filter(p => {
    const prog = progressoPacientes[p.id] || 0;
    if (filtroStatus === 'concluidos') return prog === 100;
    if (filtroStatus === 'andamento') return prog > 0 && prog < 100;
    return true;
  });

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
        {/* Banner de Boas-Vindas à Sala Vermelha */}
        <View style={styles.introCard}>
          <View style={styles.introHeaderRow}>
            <Hospital color="#10B981" size={22} />
            <Text style={styles.introTitle}>CTI / Sala de Emergência Coronariana</Text>
          </View>
          <Text style={styles.introDesc}>
            Selecione um dos leitos abaixo para assumir o atendimento do paciente e conduzir as 6 etapas clínicas.
          </Text>
        </View>

        {/* Abas de Filtros 3D Gamificadas */}
        <View style={styles.filterTabsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setFiltroStatus('todos')}
            style={[
              styles.filterTab3D,
              filtroStatus === 'todos' && styles.filterTabActive3D
            ]}
          >
            <Text style={[
              styles.filterTabText,
              filtroStatus === 'todos' && styles.filterTabTextActive
            ]}>
              TODOS LEITOS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setFiltroStatus('andamento')}
            style={[
              styles.filterTab3D,
              filtroStatus === 'andamento' && styles.filterTabActive3D
            ]}
          >
            <Text style={[
              styles.filterTabText,
              filtroStatus === 'andamento' && styles.filterTabTextActive
            ]}>
              EM ANDAMENTO
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setFiltroStatus('concluidos')}
            style={[
              styles.filterTab3D,
              filtroStatus === 'concluidos' && styles.filterTabActive3D
            ]}
          >
            <Text style={[
              styles.filterTabText,
              filtroStatus === 'concluidos' && styles.filterTabTextActive
            ]}>
              CONCLUÍDOS
            </Text>
          </TouchableOpacity>
        </View>

        {pacientesFiltrados.map((paciente, idx) => {
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
                complexidade={paciente.complexidade}
              >
                <View style={styles.patientHeader}>
                  <View style={styles.avatarCircle}>
                    <User color="#6D28D9" size={24} />
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{paciente.nome}</Text>
                    <Text style={styles.patientSub}>
                      {paciente.idade} anos • {paciente.genero} • {paciente.ocupacao}
                    </Text>
                  </View>
                  <ChevronRight color="#7C3AED" size={24} />
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
                    <Activity color="#7C3AED" size={14} />
                    <Text style={styles.progressText}>{progresso}% Atendido</Text>
                  </View>
                </View>

                {/* Botão 3D de Ação do Leito */}
                <View style={styles.actionBtnContainer}>
                  <View style={styles.atenderBtn3D}>
                    <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.atenderBtnText}>
                      {progresso === 100 ? 'REVISAR CASO CLÍNICO' : progresso > 0 ? 'CONTINUAR ATENDIMENTO' : 'ATENDER LEITO'}
                    </Text>
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
    backgroundColor: '#2E1065',
  },
  appBar: {
    height: 56,
    backgroundColor: '#3B0764',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#581C87',
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
    backgroundColor: '#3B0764',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#6D28D9',
    marginBottom: 16,
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
    color: '#DDD6FE',
    lineHeight: 18,
  },
  filterTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterTab3D: {
    flex: 0.31,
    backgroundColor: '#3B0764',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#581C87',
    borderBottomWidth: 3,
    borderBottomColor: '#1E1B4B',
  },
  filterTabActive3D: {
    backgroundColor: '#10B981',
    borderColor: '#34D399',
    borderBottomColor: '#047857',
  },
  filterTabText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#C4B5FD',
    letterSpacing: 0.5,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE9FE',
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
    backgroundColor: '#EDE9FE',
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
    marginBottom: 12,
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
    color: '#7C3AED',
    marginLeft: 4,
  },
  actionBtnContainer: {
    marginTop: 4,
  },
  atenderBtn3D: {
    backgroundColor: '#10B981',
    height: 42,
    borderRadius: 12,
    borderBottomWidth: 3.5,
    borderBottomColor: '#047857',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  atenderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
