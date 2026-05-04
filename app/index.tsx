import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeartPulse, IdCard, ArrowRight } from 'lucide-react-native';

const avatares = ['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️', '👨🏿‍⚕️', '👩🏽‍⚕️', '👱‍♀️'];

export default function WelcomeScreen() {
  const [nomeEnfermeiro, setNomeEnfermeiro] = useState('');
  const [avatarSelecionado, setAvatarSelecionado] = useState(0);
  const [loading, setLoading] = useState(true);

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
      if (Platform.OS === 'web') {
        window.alert('Por favor, digite seu nome no crachá.');
      } else {
        Alert.alert('Aviso', 'Por favor, digite seu nome no crachá.');
      }
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
    return <View style={styles.container} />; // Tela em branco enquanto verifica auth
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <HeartPulse color="#DC2626" size={40} />
          <Text style={styles.headerText}>CardioQuest</Text>
        </View>

        <Text style={styles.title}>Identificação Profissional</Text>
        <Text style={styles.subtitle}>Configure seu crachá para iniciar o plantão.</Text>

        <Text style={styles.label}>NOME DO ENFERMEIRO(A)</Text>
        <View style={styles.inputContainer}>
          <IdCard color="#9CA3AF" size={24} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome..."
            placeholderTextColor="#9CA3AF"
            value={nomeEnfermeiro}
            onChangeText={setNomeEnfermeiro}
          />
        </View>

        <Text style={styles.label}>SELECIONE SEU AVATAR</Text>
        <View style={styles.avatarContainer}>
          {avatares.map((avatar, index) => {
            const isSelected = avatarSelecionado === index;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
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

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={baterPonto}>
          <Text style={styles.buttonText}>Bater Ponto</Text>
          <ArrowRight color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 24,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginLeft: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 32,
    paddingHorizontal: 12,
    height: 56,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1F2937',
    outlineStyle: 'none' // For web
  } as any,
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  avatarBox: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarBoxSelected: {
    backgroundColor: '#DBEAFE', // blue-100
    borderColor: '#3B82F6', // blue-500
  },
  avatarEmoji: {
    fontSize: 32,
  },
  spacer: {
    flex: 1,
    minHeight: 60,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 16 : 0,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
