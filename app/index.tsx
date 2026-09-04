import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeartPulse, IdCard, ArrowRight, Hospital } from 'lucide-react-native';

const avatares = ['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️', '👨🏿‍⚕️', '👩🏽‍⚕️', '👱‍♀️'];

export default function WelcomeScreen() {
  const [nomeEnfermeiro, setNomeEnfermeiro] = useState('');
  const [avatarSelecionado, setAvatarSelecionado] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    async function checkLogin() {
      try {
        const nomeSalvo = await AsyncStorage.getItem('nomeEnfermeiro');
        const avatarSalvo = await AsyncStorage.getItem('avatarEnfermeiro');
        if (nomeSalvo && avatarSalvo) {
          router.replace('/dashboard');
        } else {
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  const baterPonto = async () => {
    if (!nomeEnfermeiro.trim()) {
      setErroMsg('Por favor, digite seu nome de registro no crachá.');
      return;
    }

    try {
      await AsyncStorage.setItem('nomeEnfermeiro', nomeEnfermeiro);
      await AsyncStorage.setItem('avatarEnfermeiro', avatares[avatarSelecionado]);
      router.replace('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <View style={styles.safeArea} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <HeartPulse color="#EF4444" size={42} />
          <Text style={styles.headerText}>CardioQuest</Text>
        </View>

        <View style={styles.badgeFormCard}>
          <View style={styles.badgeHeader}>
            <Hospital color="#38BDF8" size={20} />
            <Text style={styles.badgeHeaderTitle}>ADMISSÃO • CRACHÁ DE PLANTÃO</Text>
          </View>

          <Text style={styles.title}>Emissão de Crachá Médico</Text>
          <Text style={styles.subtitle}>
            Digite o seu nome de registro profissional para assumir o plantão no Centro de Emergência Cardiológica (UNICAMP).
          </Text>

          {erroMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{erroMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>NOME DO PROFISSIONAL / ESTUDANTE</Text>
          <View style={styles.inputContainer}>
            <IdCard color="#64748B" size={22} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Dra. Mariana / Enf. Lucas"
              placeholderTextColor="#64748B"
              value={nomeEnfermeiro}
              onChangeText={(txt) => {
                setNomeEnfermeiro(txt);
                setErroMsg('');
              }}
            />
          </View>

          <Text style={styles.label}>SELECIONE SEU AVATAR HOSPITALAR</Text>
          <View style={styles.avatarContainer}>
            {avatares.map((avatar, index) => {
              const isSelected = avatarSelecionado === index;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.75}
                  onPress={() => setAvatarSelecionado(index)}
                  style={[
                    styles.avatarBox,
                    isSelected && styles.avatarBoxSelected
                  ]}
                >
                  <Text style={styles.avatarEmoji}>{avatar}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={baterPonto}
            style={styles.button}
          >
            <Text style={styles.buttonText}>BATER PONTO & ASSUMIR PLANTÃO</Text>
            <ArrowRight color="#FFFFFF" size={22} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2E1065',
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  badgeFormCard: {
    backgroundColor: '#3B0764',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#6D28D9',
    borderBottomWidth: 5,
    borderBottomColor: '#4C1D95',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  badgeHeaderTitle: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 13,
    color: '#E9D5FF',
    marginBottom: 20,
    lineHeight: 19,
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#450A0A',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    marginBottom: 16,
  },
  errorBoxText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    color: '#C4B5FD',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#581C87',
    marginBottom: 20,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 54,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1E1B4B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#581C87',
    borderBottomWidth: 3,
    borderBottomColor: '#0F172A',
  },
  avatarBoxSelected: {
    borderColor: '#A78BFA',
    borderWidth: 2,
    borderBottomColor: '#4C1D95',
    backgroundColor: '#4C1D95',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  button: {
    backgroundColor: '#10B981',
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#34D399',
    borderBottomWidth: 5,
    borderBottomColor: '#047857',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginRight: 8,
  },
});
