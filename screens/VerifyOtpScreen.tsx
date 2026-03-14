import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); 
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert("Format invalide", "Le code doit contenir exactement 6 chiffres.");
      return;
    }

    setLoading(true);
    try {
      // !! verfication de ip adreese (ipconfig) 
      const res = await axios.post('http://172.24.64.161:5127/api/auth/verify-otp', {
        email: email,
        code: code
      });

      if (res.status === 200) {
        Alert.alert("Succès", "Authentification réussie !");
        
        // Navigation dynamique selon le rôle reçu mel Backend
        if (res.data.role === "Employee") {
          router.push('/assistant');
        } else {
          router.push('/comingsoon');
        }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Code incorrect ou expiré.";
      Alert.alert("Échec", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          
          {/* Bouton Retour */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconCircle}>
              {}
              <Ionicons name="shield-checkmark-outline" size={40} color="#e60000" />
            </View>
            <Text style={styles.title}>Vérification de sécurité</Text>
            <Text style={styles.subtitle}>Un code à 6 chiffres a été généré pour l'adresse :{"\n"}
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
            <Text style={styles.infoText}>Saisissez le code affiché sur la console du serveur pour valider.</Text>
          </View>

          <TouchableOpacity 
            style={[styles.verifyBtn, loading && { opacity: 0.7 }]} 
            onPress={handleVerify} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyText}>Vérifier le code</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendBtn} onPress={() => router.back()}>
            <Text style={styles.resendText}>Utiliser un autre compte</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 25 },
  backBtn: { marginTop: 10, marginBottom: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  iconCircle: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#fff0f0', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },
  emailBold: { color: '#e60000', fontWeight: 'bold' },
  inputContainer: { marginBottom: 30 },
  otpInput: { 
    backgroundColor: '#f5f7f9', 
    borderRadius: 15, 
    height: 70, 
    fontSize: 32, 
    textAlign: 'center', 
    fontWeight: 'bold', 
    letterSpacing: 5, 
    color: '#e60000', 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  infoText: { fontSize: 13, color: '#999', textAlign: 'center', marginTop: 15 },
  verifyBtn: { 
    backgroundColor: '#e60000', 
    paddingVertical: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    shadowColor: '#e60000', 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    elevation: 5 
  },
  verifyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resendBtn: { marginTop: 20, alignItems: 'center' },
  resendText: { color: '#666', fontSize: 14, textDecorationLine: 'underline' }
});