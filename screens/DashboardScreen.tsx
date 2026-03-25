import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen({ email: initialEmail }: { email: string }) {
  const router = useRouter();
  const [summary, setSummary] = useState({ total: 0, pending: 0, resolved: 0 });
  const [soldeConge, setSoldeConge] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState('https://ui-avatars.com/api/?name=Anas&background=e60000&color=fff');

  const API_BASE_URL = 'http://192.168.1.5:5127/api'; 

  const fetchSummary = async () => {
    try {
      let userEmail = initialEmail;
      if (!userEmail) {
        userEmail = await AsyncStorage.getItem('userEmail') || '';
      }
      if (!userEmail) return;

      const res = await axios.get(`${API_BASE_URL}/tickets/dashboard-summary/${userEmail}`);
      setSummary(res.data);
      setSoldeConge(res.data.soldeConge || 0); 
    } catch (error) {
      console.error("[DASHBOARD] Erreur", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => { 
      const loadPhoto = async () => {
        const storedPhoto = await AsyncStorage.getItem('userPhoto');
        if (storedPhoto) setProfileImage(storedPhoto);
      };
      loadPhoto();
      fetchSummary(); 
    }, [initialEmail])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dashboardText}>Tableau de bord</Text>
          <Text style={styles.welcomeText}>Bienvenue, Anas</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileContainer}
          onPress={() => router.push('/(tabs)/profile' as any)}
        >
          <Image 
            source={{ uri: profileImage }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      {/* STATS ROW */}
      <View style={styles.statsRow}>
        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => router.push({ pathname: '/(tabs)/history', params: { filter: 'All' } })}
        >
          <Ionicons name="receipt-outline" size={24} color="#666" />
          <Text style={styles.statLabel}>TOTAL</Text>
          <Text style={styles.statNumber}>{summary.total}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => router.push({ pathname: '/(tabs)/history', params: { filter: 'Pending' } })}
        >
          <Ionicons name="time-outline" size={24} color="#f39c12" />
          <Text style={styles.statLabel}>EN ATTENTE</Text>
          <Text style={styles.statNumber}>{summary.pending}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => router.push({ pathname: '/(tabs)/history', params: { filter: 'Resolved' } })}
        >
          <Ionicons name="checkmark-circle-outline" size={24} color="#27ae60" />
          <Text style={styles.statLabel}>RÉSOLU</Text>
          <Text style={styles.statNumber}>{summary.resolved}</Text>
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.soldeBox}>
        <View style={styles.soldeHeader}>
          <Ionicons name="calendar-outline" size={20} color="#e60000" />
          <Text style={styles.soldeTitle}>Mon Solde de Congé</Text>
        </View>
        <View style={styles.soldeContent}>
          <Text style={styles.soldeValue}>{soldeConge}</Text>
          <Text style={styles.soldeUnit}>Jours restants</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min((soldeConge / 30) * 100, 100)}%` }]} />
        </View>
      </View>

      <TouchableOpacity style={styles.newRequestBtn} onPress={() => router.push('/(tabs)/assistant')}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.newRequestText}>Nouvelle Demande</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Tickets Récents</Text>
      
      {loading ? <ActivityIndicator color="#e60000" /> : (
        <View style={styles.recentBox}>
           <Text style={styles.infoText}>
            {summary.total === 0 ? "Aucun ticket" : `Vous avez ${summary.total} ticket(s) au total`}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  dashboardText: { fontSize: 14, color: '#999' },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  profileContainer: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#e60000', overflow: 'hidden' },
  profileImage: { width: '100%', height: '100%' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { backgroundColor: '#f9f9f9', width: '31%', padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  statLabel: { fontSize: 9, color: '#999', marginTop: 5, fontWeight: 'bold' },
  statNumber: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  
  
  soldeBox: { backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 25, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  soldeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  soldeTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  soldeContent: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 15 },
  soldeValue: { fontSize: 32, fontWeight: 'bold', color: '#e60000' },
  soldeUnit: { fontSize: 14, color: '#999', marginLeft: 8 },
  progressBarBg: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#e60000' },

  newRequestBtn: { backgroundColor: '#e60000', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 15, marginBottom: 30, elevation: 5 },
  newRequestText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  recentBox: { alignItems: 'center', marginTop: 10 },
  infoText: { color: '#999' }
});