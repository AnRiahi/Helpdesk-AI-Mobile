import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    // 1. Validation de base
    if (!email || !password) {
      Alert.alert("Champs requis", "Veuillez saisir votre email et mot de passe.");
      return;
    }

    setLoading(true);
    try {
      // !! Adresse ip (il faut que adresse  ip est valide )
      // On utilise l'ip de pc pas de localhost car tlf utilise ip pc ctt 
      const res = await axios.post('http://172.24.64.161:5127/api/auth/login', { 
        email, 
        password 
      });

      // 2. Si login est valide , backend cree un otp
      Alert.alert("Sécurité IA", "Un code de vérification a été généré sur le serveur.");
      
      // 3. Navigation vers 'app/verify.tsx' (Path m-raggel m3a el architecture jdida)
      router.push({ 
        pathname: '/verify' as any, 
        params: { email: email } 
      });

    } catch (error: any) {
      // Gérer les erreurs (Email faux, Pwd faux, ou Server )
      const msg = error.response?.data?.message || "Impossible de se connecter au serveur. Vérifiez votre connexion.";
      Alert.alert("Erreur de connexion", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Logo Devoteam */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo-devoteam.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>

          {/* Carte de Connexion */}
          <View style={styles.card}>
            <Text style={styles.title}>Bienvenue sur le Helpdesk IA</Text>
            <Text style={styles.subtitle}>Connectez-vous pour accéder au support interne.</Text>

            {/* Input Email */}
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

            {/* Input Password */}
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

            {/* Bouton Se Connecter */}
            <TouchableOpacity 
              style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
              onPress={handleLogin} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.loginText}>Se connecter</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>

            {/* Lien Inscription */}
            <TouchableOpacity onPress={() => router.push('/register' as any)} style={styles.footerLink}>
              <Text style={styles.footerText}>
                Pas encore de compte ? <Text style={styles.linkBold}>Créer un compte</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Securité */}
          <View style={styles.securityFooter}>
             <Ionicons name="shield-checkmark-outline" size={16} color="#999" />
             <Text style={styles.securityText}> Sécurisé | 🌐 Français</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fdfdfd' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 180, height: 50 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 25, 
    padding: 25, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 15, 
    borderWidth: 1, 
    borderColor: '#f0f0f0' 
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#777', textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginLeft: 4 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f5f7f9', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 55, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#333' },
  loginBtn: { 
    backgroundColor: '#e60000', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10, 
    elevation: 5 
  },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footerLink: { marginTop: 25, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#666' },
  linkBold: { color: '#e60000', fontWeight: 'bold' },
  securityFooter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  securityText: { fontSize: 12, color: '#999', marginLeft: 5 }
});