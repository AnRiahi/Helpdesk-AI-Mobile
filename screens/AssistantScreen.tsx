import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AIAssistantScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getPriorityData = (priority: string) => {
    switch (priority) {
      case 'Critical': return { tag: 'P1', sla: '1 heure', bg: '#ffebee', text: '#d32f2f' };
      case 'High': return { tag: 'P2', sla: '2 heures', bg: '#fff3e0', text: '#ef6c00' };
      default: return { tag: 'P3', sla: '4 heures', bg: '#e8f5e9', text: '#2e7d32' };
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission", "Accès à la galerie requis.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const handleAnalyze = async () => {
    if (!message) return;
    setLoading(true);
    try {
      // API de l'analyse IA (Gemini)
      const res = await axios.post('http://172.24.64.161:5127/api/ai/analyze', { message });
      setAiResult(res.data);
      setIsConfirming(true);
    } catch (error) {
      Alert.alert("Erreur", "Backend injoignable. Vérifiez votre serveur et l'IP.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const ticketData = {
        description: message,
        service: aiResult.service,
        priority: aiResult.priority || "Medium",
        requestType: aiResult.requestType || "General",
        status: "Open",
        summary: aiResult.summary || message.substring(0, 50), 
        startDate: aiResult.extractedData?.dates?.startDate,
        endDate: aiResult.extractedData?.dates?.endDate
      };

      await axios.post('http://172.24.64.161:5127/api/tickets', ticketData);
      Alert.alert("Succès", "Ticket enregistré avec succès !");
      resetApp();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sauvegarder le ticket.");
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setAiResult(null);
    setIsConfirming(false);
    setMessage('');
    setSelectedImage(null);
  };

  if (isConfirming && aiResult) {
    const isRH = aiResult.service?.toUpperCase() === 'HR' || aiResult.service?.toUpperCase() === 'RH';
    const isMaladie = aiResult.requestType?.toLowerCase().includes('maladie') || 
                     aiResult.requestType?.toLowerCase().includes('sick');
    const pData = !isRH ? getPriorityData(aiResult.priority) : null;

    return (
      <View style={styles.container}>
        <View style={styles.headerConfirmation}>
          <TouchableOpacity onPress={() => setIsConfirming(false)}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Résumé du Ticket</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.infoText}>Détails de votre demande {isRH ? 'RH' : 'IT'} analysés par l'IA.</Text>
          
          <View style={styles.confirmCard}>
            <View style={styles.sectionHeader}>
               <Ionicons name="document-text-outline" size={20} color="#ff4d4d" />
               <Text style={styles.sectionTitleConfirm}> DESCRIPTION</Text>
            </View>
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>"{message}"</Text>
            </View>

            {/* --- TYPE DE REQUÊTE (AJOUTÉ) --- */}
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#fff0f0' }]}>
                <Ionicons name="list-outline" size={20} color="#ff4d4d" />
              </View>
              <View>
                <Text style={styles.rowLabel}>Type de demande</Text>
                <Text style={styles.rowValue}>{aiResult.requestType || "Demande Générale"}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#f0f4ff' }]}>
                <Ionicons name="apps-outline" size={20} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.rowLabel}>Service</Text>
                <Text style={styles.rowValue}>{aiResult.service}</Text>
              </View>
            </View>

            {isRH ? (
              <View style={styles.row}>
                <View style={[styles.iconBox, { backgroundColor: '#e6fff0' }]}>
                  <Ionicons name="calendar-outline" size={20} color="#28a745" />
                </View>
                <View>
                  <Text style={styles.rowLabel}>Période</Text>
                  <Text style={styles.rowValue}>
                    {aiResult.extractedData?.dates?.startDate 
                      ? `Du ${aiResult.extractedData.dates.startDate} au ${aiResult.extractedData.dates.endDate || '?'}`
                      : "Dates non spécifiées"}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: '#fff4e6' }]}>
                    <Ionicons name="alert-circle-outline" size={20} color="#FFA500" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowLabel}>Priorité</Text>
                    <Text style={styles.rowValue}>{aiResult.priority}</Text>
                  </View>
                  <View style={[styles.pTag, { backgroundColor: pData?.bg }]}>
                    <Text style={[styles.pText, { color: pData?.text }]}>{pData?.tag}</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: '#e6fff0' }]}>
                    <Ionicons name="time-outline" size={20} color="#28a745" />
                  </View>
                  <View>
                    <Text style={styles.rowLabel}>SLA estimé</Text>
                    <Text style={[styles.rowValue, { color: '#28a745' }]}>{pData?.sla}</Text>
                  </View>
                </View>
              </>
            )}

            {isMaladie && (
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Ionicons name={selectedImage ? "checkmark-circle" : "cloud-upload-outline"} size={20} color={selectedImage ? "#28a745" : "#666"} />
                <Text style={[styles.uploadButtonText, selectedImage && {color: '#28a745'}]}>
                  {selectedImage ? "Certificat ajouté" : "Ajouter certificat médical"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleConfirm} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.sendButtonText}>Confirmer l'envoi  ➤</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.modifyButton} onPress={() => setIsConfirming(false)}>
            <Text style={styles.modifyButtonText}>Modifier les détails</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}><Ionicons name="sparkles" size={30} color="#ff4d4d" /></View>
        <Text style={styles.title}>AI Assistant</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder="Décrivez votre problème..." multiline value={message} onChangeText={setMessage} />
        </View>

        <Text style={styles.sectionTitle}>QUICK TEMPLATES</Text>
        <View style={styles.templateRow}>
          <TemplateItem icon="medkit-outline" label="Maladie" onPress={() => setMessage("Je suis malade. Je m'absente du [Date] au [Date].")} />
          <TemplateItem icon="calendar-outline" label="Congé" onPress={() => setMessage("Demande de congé du [Date] au [Date].")} />
          <TemplateItem icon="desktop-outline" label="Panne IT" onPress={() => setMessage("Mon écran ne s'allume plus.")} />
          <TemplateItem icon="wifi-outline" label="Connexion" onPress={() => setMessage("Problème d'accès au VPN entreprise.")} />
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={handleAnalyze} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.sendButtonText}>Send Request</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const TemplateItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.template} onPress={onPress}>
    <Ionicons name={icon} size={18} color="#333" />
    <Text style={styles.templateLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 20 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff0f0', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  headerConfirmation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 50 },
  content: { padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 20, elevation: 4, marginBottom: 20 },
  input: { fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  infoText: { textAlign: 'center', color: '#777', marginBottom: 20, fontSize: 14 },
  confirmCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitleConfirm: { color: '#ff4d4d', fontWeight: 'bold', fontSize: 10, marginTop: 10 },
  descriptionBox: { backgroundColor: '#f1f4f8', padding: 15, borderRadius: 12, marginBottom: 20 },
  descriptionText: { fontStyle: 'italic', color: '#444' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBox: { padding: 10, borderRadius: 12, marginRight: 15 },
  rowLabel: { fontSize: 12, color: '#aaa' },
  rowValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  pTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pText: { fontWeight: 'bold', fontSize: 12 },
  sendButton: { backgroundColor: '#ff4d4d', paddingVertical: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, justifyContent: 'center' },
  sendButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modifyButton: { paddingVertical: 15, alignItems: 'center', marginTop: 10 },
  modifyButtonText: { color: '#666', fontSize: 14 },
  templateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  template: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 20, elevation: 2 },
  templateLabel: { marginLeft: 8, fontSize: 13 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#aaa', marginBottom: 10 },
  uploadButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 12, padding: 15, marginTop: 8, justifyContent: 'center' },
  uploadButtonText: { marginLeft: 10, color: '#666', fontSize: 14, fontWeight: '500' },
});