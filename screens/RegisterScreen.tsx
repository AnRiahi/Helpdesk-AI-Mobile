import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [role, setRole] = useState('Employee');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validation simple des champs vides
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Champs requis", "Veuillez remplir toutes les informations.");
      return;
    }

    // 2. Validation de la correspondance des mots de passe
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Le mot de passe et la confirmation ne sont pas identiques.");
      return;
    }

    setLoading(true);
    try {
      // ADRESSE IP DU SERVEUR .NET (Vérifie ton ipconfig)
      await axios.post('http://172.24.64.161:5127/api/auth/register', {
        fullName,
        email,
        password,
        role: role
      });

      Alert.alert("Succès", "Votre compte a été créé !");
      router.push('/'); 
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erreur de connexion au serveur.";
      Alert.alert("Inscription refusée", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Rejoindre Devoteam IA</Text>
        <Text style={styles.subtitle}>Créez votre compte professionnel</Text>

        <View style={styles.inputWrapper}>
          <TextInput placeholder="Nom complet" style={styles.input} value={fullName} onChangeText={setFullName} />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput placeholder="Email (@devoteam.com)" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
        </View>

        <Text style={styles.label}>Sélectionnez votre rôle :</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)} style={styles.picker}>
            <Picker.Item label="Employé" value="Employee" />
            <Picker.Item label="Agent IT" value="AgentIT" />
            <Picker.Item label="Agent RH" value="AgentRH" />
            <Picker.Item label="Admin Superviseur" value="Admin" />
          </Picker>
        </View>

        {/* Input Mot de passe */}
        <View style={styles.inputWrapper}>
          <TextInput 
            placeholder="Mot de passe" 
            secureTextEntry 
            style={styles.input} 
            value={password} 
            onChangeText={setPassword} 
          />
        </View>

        {/* Input Confirmation Mot de passe */}
        <View style={styles.inputWrapper}>
          <TextInput 
            placeholder="Confirmer le mot de passe" 
            secureTextEntry 
            style={styles.input} 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
          />
        </View>

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerText}>S'INSCRIRE</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/')} style={styles.footerLink}>
          <Text style={styles.footerText}>Déjà un compte ? <Text style={styles.linkBold}>Connexion</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 25, paddingTop: 30, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 35 },
  inputWrapper: { backgroundColor: '#f9f9f9', borderRadius: 12, paddingHorizontal: 15, height: 55, justifyContent: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  input: { fontSize: 16, color: '#333' },
  label: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 8, marginLeft: 5 },
  pickerWrapper: { backgroundColor: '#f9f9f9', borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#eee', height: 55, justifyContent: 'center', overflow: 'hidden' },
  picker: { width: '100%', color: '#333' },
  registerBtn: { backgroundColor: '#e60000', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  registerText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  footerLink: { marginTop: 25, alignItems: 'center' },
  footerText: { fontSize: 15, color: '#666' },
  linkBold: { color: '#e60000', fontWeight: 'bold' }
});