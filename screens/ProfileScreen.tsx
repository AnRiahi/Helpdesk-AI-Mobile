import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const API_BASE_URL = 'http://192.168.1.5:5127/api'; 
  
  const [email, setEmail] = useState('Chargement...');
  const [name, setName] = useState('Utilisateur'); 
  const [role, setRole] = useState('Employé');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [dept, setDept] = useState('IT');
  const [equipe, setEquipe] = useState('Development');
  const [profileImage, setProfileImage] = useState('https://ui-avatars.com/api/?name=User&background=e60000&color=fff');
  
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const avatars = [
    { id: '1', url: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png' },
    { id: '2', url: 'https://cdn-icons-png.flaticon.com/512/219/219983.png' },
    { id: '3', url: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' },
    { id: '4', url: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png' },
    { id: '5', url: 'https://cdn-icons-png.flaticon.com/512/1154/1154473.png' },
    { id: '6', url: 'https://cdn-icons-png.flaticon.com/512/6997/6997662.png' },
  ];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedPhoto = await AsyncStorage.getItem('userPhoto');
        const storedName = await AsyncStorage.getItem('userName');
        const storedRole = await AsyncStorage.getItem('userRole');
        const storedPhone = await AsyncStorage.getItem('userPhone');
        const storedBirthday = await AsyncStorage.getItem('userBirthday');
        const storedDept = await AsyncStorage.getItem('userDept');
        const storedEquipe = await AsyncStorage.getItem('userEquipe');

        if (storedEmail) setEmail(storedEmail);
        if (storedName) setName(storedName);
        if (storedRole) setRole(storedRole);
        if (storedPhone) setPhone(storedPhone);
        if (storedBirthday) setBirthday(storedBirthday);
        if (storedDept) setDept(storedDept || 'IT');
        if (storedEquipe) setEquipe(storedEquipe || 'Development');

        if (storedPhoto) {
          setProfileImage(storedPhoto);
        } else {
          setProfileImage(`https://ui-avatars.com/api/?name=${storedName || 'User'}&background=e60000&color=fff`);
        }
      } catch (error) {
        console.error("Erreur loading data", error);
      }
    };
    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userPhone', phone);
      await AsyncStorage.setItem('userBirthday', birthday);
      await AsyncStorage.setItem('userDept', dept);
      await AsyncStorage.setItem('userEquipe', equipe);
      Alert.alert("✅", "Profil mis à jour !");
    } catch (error) {
      Alert.alert("🚫", "Erreur d'enregistrement.");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("⚠️", "Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("🔐", "Les mots de passe ne correspondent pas.");
      return;
    }
    setLoadingPassword(true);
    try {
      await axios.post(`${API_BASE_URL}/Auth/change-password?email=${email}&oldPassword=${oldPassword}&newPassword=${newPassword}`);
      Alert.alert("✅", "Mot de passe mis à jour !");
      setPasswordModalVisible(false);
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (error: any) {
      Alert.alert("🚫", error.response?.data?.message || "Erreur serveur.");
    } finally {
      setLoadingPassword(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled) {
      const newPhoto = result.assets[0].uri;
      setProfileImage(newPhoto);
      await AsyncStorage.setItem('userPhoto', newPhoto);
    }
  };

  const selectAvatar = async (url: string) => {
    setProfileImage(url);
    await AsyncStorage.setItem('userPhoto', url);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f7f6' }}>
      <View style={styles.backgroundBande} />
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.imageWrapper} onPress={() => setModalVisible(true)}>
              <Image source={{ uri: profileImage }} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editBadge} onPress={pickImage}><Ionicons name="camera" size={18} color="#fff" /></TouchableOpacity>
          </View>
          <Text style={styles.userNameDisplay}>{name}</Text>
          <Text style={styles.userRoleDisplay}>{role}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Informations Personnelles</Text>
          <View style={styles.inputGroup}><Text style={styles.label}>NOM COMPLET</Text><TextInput style={styles.input} value={name} onChangeText={setName} /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>DATE DE NAISSANCE</Text><TextInput style={styles.input} value={birthday} onChangeText={setBirthday} placeholder="JJ/MM/AAAA" /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>TÉLÉPHONE</Text><TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>ADRESSE EMAIL (Lecture seule)</Text><View style={styles.disabledInput}><Ionicons name="mail-outline" size={18} color="#999" /><Text style={styles.infoValue}>{email}</Text></View></View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Organisation</Text>
          <Text style={styles.label}>DÉPARTEMENT</Text>
          <View style={styles.pickerWrapper}><Picker selectedValue={dept} onValueChange={setDept}><Picker.Item label="Informatique (IT)" value="IT" /><Picker.Item label="Ressources Humaines (HR)" value="HR" /><Picker.Item label="Marketing" value="MKT" /></Picker></View>
          <Text style={styles.label}>ÉQUIPE</Text>
          <View style={styles.pickerWrapper}><Picker selectedValue={equipe} onValueChange={setEquipe}><Picker.Item label="Development Team" value="Development" /><Picker.Item label="Support Technique" value="Support" /><Picker.Item label="Design UI/UX" value="Design" /></Picker></View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Sécurité</Text>
          <TouchableOpacity style={styles.actionRow} onPress={() => setPasswordModalVisible(true)}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Changer le mot de passe</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}><Text style={styles.saveBtnText}>Enregistrer</Text></TouchableOpacity>
      </ScrollView>

      {}
      <Modal visible={passwordModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sécurité</Text>
            <TextInput style={styles.modalInput} placeholder="Ancien mot de passe" secureTextEntry value={oldPassword} onChangeText={setOldPassword} />
            <TextInput style={styles.modalInput} placeholder="Nouveau mot de passe" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
            <TextInput style={styles.modalInput} placeholder="Confirmer" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            <View style={styles.modalActionRow}>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}><Text style={styles.cancelBtnText}>Annuler</Text></TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleChangePassword}>
                {loadingPassword ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmBtnText}>Valider</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir un Avatar</Text>
            <View style={styles.avatarGrid}>
              {avatars.map((item: any) => (
                <TouchableOpacity key={item.id} onPress={() => selectAvatar(item.url)} style={styles.avatarOption}>
                  <Image source={{ uri: item.url }} style={styles.avatarThumb} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}><Text style={styles.closeBtnText}>Annuler</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundBande: { position: 'absolute', top: -150, left: -50, width: width + 100, height: 380, backgroundColor: '#e60000', transform: [{ rotate: '-5deg' }], borderBottomLeftRadius: 80, borderBottomRightRadius: 80 },
  headerSection: { alignItems: 'center', paddingBottom: 25, paddingTop: 60 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 25, color: '#fff' },
  imageSection: { position: 'relative', marginBottom: 15 },
  imageWrapper: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff', elevation: 10, overflow: 'hidden', backgroundColor: '#fff' },
  image: { width: '100%', height: '100%' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#e60000', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  userNameDisplay: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  userRoleDisplay: { fontSize: 14, color: '#666', fontWeight: '600', marginTop: 5 },
  sectionCard: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 20, borderRadius: 20, padding: 20, elevation: 4 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 10, fontWeight: 'bold', color: '#bbb', marginBottom: 5, textTransform: 'uppercase' },
  input: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 5, fontSize: 15, color: '#444' },
  disabledInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10 },
  infoValue: { marginLeft: 10, color: '#777', fontSize: 14 },
  pickerWrapper: { backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee', overflow: 'hidden' },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  actionText: { flex: 1, marginLeft: 15, fontSize: 14, color: '#444' },
  saveBtn: { backgroundColor: '#e60000', marginHorizontal: 25, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30, elevation: 5 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '85%', padding: 25, borderRadius: 25, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  modalInput: { backgroundColor: '#f9f9f9', width: '100%', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  modalActionRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15, alignItems: 'center' },
  cancelBtnText: { color: '#666', fontWeight: '600' },
  confirmBtn: { backgroundColor: '#e60000', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 12 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold' },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  avatarOption: { margin: 10 },
  avatarThumb: { width: 60, height: 60, borderRadius: 30 },
  closeBtn: { marginTop: 20 },
  closeBtnText: { color: '#e60000', fontWeight: 'bold' }
});