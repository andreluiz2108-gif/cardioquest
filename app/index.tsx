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
            <Text style={styles.buttonText}>Bater Ponto & Assumir Plantão</Text>
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
    backgroundColor: '#0F172A',
  },
  container: {
    padding: 24,
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
    fontSize: 30,
    fontWeight: '900',
    color: '#F8FAFC',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  badgeFormCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#334155',
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
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 20,
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#451A03',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#78350F',
    marginBottom: 16,
  },
  errorBoxText: {
    color: '#FDE047',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 52,
    color: '#F8FAFC',
    fontSize: 15,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  avatarBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatarBoxSelected: {
    borderColor: '#38BDF8',
    borderWidth: 2,
    backgroundColor: '#1E3A8A',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  button: {
    backgroundColor: '#2563EB',
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
