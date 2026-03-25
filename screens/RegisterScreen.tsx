import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [role, setRole] = useState('Employee');
  const [roleLabel, setRoleLabel] = useState('Employé');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const roles = [
    { id: 'Employee', label: 'Employé', emoji: '👨‍💻', color: '#3498db' },
    { id: 'AgentIT', label: 'Agent IT', emoji: '🛠️', color: '#e67e22' },
    { id: 'AgentRH', label: 'Agent RH', emoji: '🤝', color: '#9b59b6' },
    { id: 'Admin', label: 'Admin Superviseur', emoji: '🛡️', color: '#e60000' },
  ];

  const selectRole = (item: any) => {
    setRole(item.id);
    setRoleLabel(item.label);
    setModalVisible(false);
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("⚠️", "Veuillez remplir toutes les informations.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("🔐", "Le mot de passe et la confirmation ne sont pas identiques.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://192.168.1.5:5127/api/auth/register', {
        fullName,
        email,
        password,
        role: role
      });
      Alert.alert("✅", "Votre compte professionnel a été créé avec succès.");
      router.push('/'); 
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Connexion au serveur impossible.";
      Alert.alert("🚫", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {}
      <View style={styles.backgroundBande} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
           <Text style={styles.title}>Rejoindre Devoteam IA</Text>
           <Text style={styles.subtitle}>Créez votre compte professionnel</Text>
        </View>

        <View style={styles.formCard}>
            <View style={styles.inputWrapper}>
              <TextInput placeholder="Nom complet" style={styles.input} value={fullName} onChangeText={setFullName} />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput placeholder="Email (@devoteam.com)" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
            </View>

            <Text style={styles.label}>Sélectionnez votre rôle :</Text>
            <TouchableOpacity style={styles.customPicker} onPress={() => setModalVisible(true)}>
              <Text style={styles.pickerValueText}>
                 {roles.find(r => r.id === role)?.emoji}  {roleLabel}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
              <TextInput placeholder="Mot de passe" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput placeholder="Confirmer le mot de passe" secureTextEntry style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} />
            </View>

            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerText}>S'INSCRIRE</Text>}
            </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/')} style={styles.footerLink}>
          <Text style={styles.footerText}>Déjà un compte ? <Text style={styles.linkBold}>Connexion</Text></Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL LEL ROLES (BOTTTOM SHEET STYLE) */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderIndicator} />
              <Text style={styles.modalTitle}>Choisissez votre rôle</Text>
              {roles.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.roleCard, { borderColor: role === item.id ? item.color : '#eee' }]} 
                  onPress={() => selectRole(item)}
                >
                  <View style={[styles.emojiBox, { backgroundColor: item.color + '15' }]}>
                    <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                  </View>
                  <Text style={[styles.roleLabelText, { color: role === item.id ? item.color : '#333' }]}>{item.label}</Text>
                  {role === item.id && <Ionicons name="checkmark-circle" size={24} color={item.color} />}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  
  
  backgroundBande: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: width + 100,
    height: 350,
    backgroundColor: '#e60000',
    transform: [{ rotate: '-10deg' }], // Diagonal effect
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },

  scrollContainer: { flexGrow: 1, paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40 },
  headerBox: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#ffeaea', textAlign: 'center' },
  
  
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  inputWrapper: { backgroundColor: '#f9f9f9', borderRadius: 12, paddingHorizontal: 15, height: 55, justifyContent: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  input: { fontSize: 16, color: '#333' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 8, marginLeft: 5 },
  customPicker: { backgroundColor: '#f9f9f9', borderRadius: 12, paddingHorizontal: 15, height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  pickerValueText: { fontSize: 16, color: '#333' },

  registerBtn: { backgroundColor: '#e60000', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  registerText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
  modalHeaderIndicator: { width: 40, height: 5, backgroundColor: '#eee', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 19, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  roleCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, borderWidth: 2, marginBottom: 12, backgroundColor: '#fff' },
  emojiBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  roleLabelText: { flex: 1, fontSize: 16, fontWeight: 'bold' },
  closeModalBtn: { marginTop: 10, alignItems: 'center', padding: 10 },
  closeModalText: { color: '#999', fontSize: 16, fontWeight: '600' },

  footerLink: { marginTop: 25, alignItems: 'center' },
  footerText: { fontSize: 15, color: '#666' },
  linkBold: { color: '#e60000', fontWeight: 'bold' }
});