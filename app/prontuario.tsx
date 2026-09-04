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
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Hospital, 
  ClipboardType, 
  HeartPulse, 
  Pill, 
  FlaskConical, 
  HeartHandshake, 
  Lock, 
  PlayCircle,
  ArrowLeft,
  ChevronRight
} from 'lucide-react-native';
import { getPatientById } from '../data/patientsData';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import MedicalClipboardCard from '../components/ui/MedicalClipboardCard';

export default function ProntuarioScreen() {
  const params = useLocalSearchParams<{ patientId?: string }>();
  const patientId = params.patientId || 'carlos';
  const paciente = getPatientById(patientId);

  const [mod2Liberado, setMod2Liberado] = useState(false);
  const [mod3Liberado, setMod3Liberado] = useState(false);
  const [mod4Liberado, setMod4Liberado] = useState(false);
  const [mod5Liberado, setMod5Liberado] = useState(false);
  const [mod6Liberado, setMod6Liberado] = useState(false);

  const carregarProgresso = async () => {
    try {
      const m2 = await AsyncStorage.getItem(`venceu_mod1_paciente_${patientId}`);
      const m3 = await AsyncStorage.getItem(`venceu_mod2_paciente_${patientId}`);
      const m4 = await AsyncStorage.getItem(`venceu_mod3_paciente_${patientId}`);
      const m5 = await AsyncStorage.getItem(`venceu_mod4_paciente_${patientId}`);
      const m6 = await AsyncStorage.getItem(`venceu_mod5_paciente_${patientId}`);

      if (patientId === 'carlos' && !m2) {
        const m2Old = await AsyncStorage.getItem('venceu_mod1');
        const m3Old = await AsyncStorage.getItem('venceu_mod2');
        const m4Old = await AsyncStorage.getItem('venceu_mod3');
        const m5Old = await AsyncStorage.getItem('venceu_mod4');
        const m6Old = await AsyncStorage.getItem('venceu_mod5');
        setMod2Liberado(m2Old === 'true');
        setMod3Liberado(m3Old === 'true');
        setMod4Liberado(m4Old === 'true');
        setMod5Liberado(m5Old === 'true');
        setMod6Liberado(m6Old === 'true');
      } else {
        setMod2Liberado(m2 === 'true');
        setMod3Liberado(m3 === 'true');
        setMod4Liberado(m4 === 'true');
        setMod5Liberado(m5 === 'true');
        setMod6Liberado(m6 === 'true');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarProgresso();
    }, [patientId])
  );

  const ModuloDesafio = ({ numero, titulo, descricao, Icone, cor, isLocked, rota }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={isLocked ? 1 : 0.85}
        onPress={() => { if (!isLocked) router.push(rota); }}
        style={[
          styles.moduloCard3D,
          {
            backgroundColor: isLocked ? '#1E1B4B' : '#3B0764',
            borderColor: isLocked ? '#312E81' : '#6D28D9',
            borderBottomColor: isLocked ? '#0F0E2A' : '#1E1B4B',
          }
        ]}
      >
        <View style={[
          styles.iconCircle,
          { 
            backgroundColor: isLocked ? '#312E81' : `${cor}25`,
            borderColor: isLocked ? '#4338CA' : cor
          }
        ]}>
          {isLocked ? (
            <Lock color="#6366F1" size={22} />
          ) : (
            <Icone color={cor} size={24} />
          )}
        </View>

        <View style={styles.moduloTextContainer}>
          <Text style={[
            styles.moduloTitle,
            { color: isLocked ? '#6366F1' : '#F8FAFC' }
          ]}>
            {numero}. {titulo}
          </Text>
          <Text style={[
            styles.moduloDesc,
            { color: isLocked ? '#4338CA' : '#C4B5FD' }
          ]}>
            {descricao}
          </Text>
        </View>

        {!isLocked ? (
          <View style={[styles.playBadge3D, { backgroundColor: cor }]}>
            <PlayCircle color="#FFFFFF" size={22} />
          </View>
        ) : (
          <Text style={styles.lockedTag}>BLOQUEADO</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>LEITO: {paciente.nome.toUpperCase()}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Monitor Multiparamétrico Fixo */}
      <PatientMonitorHeader
        nomePaciente={paciente.nome}
        leitoNumero="01"
        sinaisVitais={paciente.anamnese.sinaisVitais}
        estadoAlarme={paciente.complexidade >= 4 ? 'critico' : paciente.complexidade === 3 ? 'atencao' : 'estavel'}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Prontuário Médico de Papel Físico */}
        <MedicalClipboardCard
          titulo="FICHA ADMISSIONAL DE EMERGÊNCIA"
          complexidade={paciente.complexidade}
        >
          <Text style={styles.admissaoName}>
            {paciente.nome}, {paciente.idade} anos ({paciente.ocupacao})
          </Text>
          <Text style={styles.admissaoDesc}>
            <Text style={{ fontWeight: 'bold' }}>Queixa Principal: </Text>
            {paciente.queixaPrincipal}
          </Text>
          <Text style={[styles.admissaoDesc, { marginTop: 6, fontStyle: 'italic', color: '#6D28D9' }]}>
            {paciente.resumoClinico}
          </Text>
        </MedicalClipboardCard>

        <Text style={styles.sectionTitle}>Evolução Clínica & Condutas</Text>

        <ModuloDesafio
          numero="1"
          titulo="Triagem (Manchester)"
          descricao="Classifique a prioridade de atendimento."
          Icone={Hospital}
          cor="#F97316"
          isLocked={false}
          rota={`/triagem?patientId=${patientId}`}
        />

        <ModuloDesafio
          numero="2"
          titulo="Anamnese Direcionada"
          descricao="Colete sinais vitais e histórico de risco."
          Icone={ClipboardType}
          cor="#38BDF8"
          isLocked={!mod2Liberado}
          rota={`/anamnese?patientId=${patientId}`}
        />

        <ModuloDesafio
          numero="3"
          titulo="Eletrocardiograma (ECG)"
          descricao="Interprete o laudo e alterações isquêmicas."
          Icone={HeartPulse}
          cor="#10B981"
          isLocked={!mod3Liberado}
          rota={`/ecg?patientId=${patientId}`}
        />

        <ModuloDesafio
          numero="4"
          titulo="Intervenção Farmacológica"
          descricao="Prescreva os fármacos e conduta de reperfusão."
          Icone={Pill}
          cor="#A855F7"
          isLocked={!mod4Liberado}
          rota={`/protocolo?patientId=${patientId}`}
        />

        <ModuloDesafio
          numero="5"
          titulo="Laboratório (Biomarcadores)"
          descricao="Avalie a curva enzimática de Troponina."
          Icone={FlaskConical}
          cor="#6366F1"
          isLocked={!mod5Liberado}
          rota={`/enzimas?patientId=${patientId}`}
        />

        <ModuloDesafio
          numero="6"
          titulo="Alta e Orientações"
          descricao="Prescreva prevenção secundária e orientações."
          Icone={HeartHandshake}
          cor="#14B8A6"
          isLocked={!mod6Liberado}
          rota={`/alta?patientId=${patientId}`}
        />
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
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  admissaoName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  admissaoDesc: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  moduloCard3D: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 4.5,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduloTextContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  moduloTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  moduloDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  playBadge3D: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6366F1',
    letterSpacing: 0.5,
  },
});
