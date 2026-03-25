import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("⚠️", "Veuillez saisir votre email et mot de passe.");
      return;
    }

    setLoading(true);
    try {
      // API Call Backend
      const res = await axios.post('http://192.168.1.5:5127/api/auth/login', { email, password });

      // SAVE  EMAIL POUR L'UTILISER DANS  PROFILE/VERIFY
      await AsyncStorage.setItem('userEmail', email);

      Alert.alert("🔐", "Un code de vérification a été généré et envoyé sur votre mail.");
      
      router.push({ 
        pathname: '/verify', 
        params: { email: email } 
      });

    } catch (error: any) {
      const msg = error.response?.data?.message || "Identifiants incorrects ou erreur serveur.";
      Alert.alert("🚫", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundBande} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo-devoteam.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Bienvenue sur le Helpdesk IA</Text>
            <Text style={styles.subtitle}>Connectez-vous pour accéder au support interne.</Text>

            <Text style={styles.label}>Adresse email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
              <TextInput 
                placeholder="nom@devoteam.com" 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
                keyboardType="email-address" 
              />
            </View>

            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
              <TextInput 
                placeholder="........" 
                secureTextEntry={secureText} 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons name={secureText ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
              onPress={handleLogin} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : (
                <View style={styles.btnContent}>
                  <Text style={styles.loginText}>Se connecter</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register' as any)} style={styles.footerLink}>
              <Text style={styles.footerText}>Pas encore de compte ? <Text style={styles.linkBold}>Créer un compte</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  logo: { width: 180, height: 65 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 25, 
    padding: 25, 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 15, 
    borderWidth: 1, 
    borderColor: '#f0f0f0' 
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#777', textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f7f9', borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#333' },
  loginBtn: { backgroundColor: '#e60000', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, elevation: 5 },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footerLink: { marginTop: 25, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#666' },
  linkBold: { color: '#e60000', fontWeight: 'bold' }
});