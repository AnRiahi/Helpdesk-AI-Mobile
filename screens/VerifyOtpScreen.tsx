import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); 
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert("⚠️", "Le code doit contenir exactement 6 chiffres.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://192.168.1.5:5127/api/auth/verify-otp', {
        email: email,
        code: code
      });

      if (res.status === 200) {
        if (res.data.role) await AsyncStorage.setItem('userRole', res.data.role);
        if (res.data.fullName) await AsyncStorage.setItem('userName', res.data.fullName);
        
        Alert.alert("✅", "Authentification réussie !");
        
        router.replace({
          pathname: '/(tabs)/dashboard', 
          params: { email: email }
        });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Code incorrect ou expiré.";
      Alert.alert("🚫", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {}
      <View style={styles.backgroundBande} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons name="shield-checkmark-outline" size={40} color="#e60000" />
              </View>
              <Text style={styles.title}>Vérification</Text>
              <Text style={styles.subtitle}>Saisissez le code envoyé à :{"\n"}
                <Text style={styles.emailBold}>{email}</Text>
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.otpInput}
                placeholder="000000"
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
                autoFocus={true}
              />
              <Text style={styles.infoText}>Vérifiez votre console ou vos mails.</Text>
            </View>

            <TouchableOpacity 
              style={[styles.verifyBtn, loading && { opacity: 0.7 }]} 
              onPress={handleVerify} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyText}>Vérifier le code</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendBtn} onPress={() => router.back()}>
              <Text style={styles.resendText}>Changer de compte</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  
  
  backgroundBande: {
    position: 'absolute',
    top: -120,
    left: -50,
    width: width + 100,
    height: 350,
    backgroundColor: '#e60000',
    transform: [{ rotate: '-8deg' }],
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },

  container: { flex: 1, padding: 20 },
  backBtn: { marginTop: 10, marginBottom: 20, marginLeft: 5 },

  
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    marginTop: 20
  },

  header: { alignItems: 'center', marginBottom: 30 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  emailBold: { color: '#e60000', fontWeight: 'bold' },

  inputContainer: { marginBottom: 25 },
  otpInput: { 
    backgroundColor: '#f5f7f9', 
    borderRadius: 15, 
    height: 65, 
    fontSize: 28, 
    textAlign: 'center', 
    fontWeight: 'bold', 
    letterSpacing: 8, 
    color: '#e60000', 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  infoText: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 12 },

  verifyBtn: { 
    backgroundColor: '#e60000', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    elevation: 4 
  },
  verifyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  resendBtn: { marginTop: 20, alignItems: 'center' },
  resendText: { color: '#666', fontSize: 13, textDecorationLine: 'underline' }
});