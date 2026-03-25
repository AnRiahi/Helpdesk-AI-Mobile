import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HistoryScreen({ email: initialEmail }: { email: string }) {
  const { filter: navFilter } = useLocalSearchParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      let userEmail = initialEmail;
      if (!userEmail) {
        userEmail = await AsyncStorage.getItem('userEmail') || '';
      }
      if (!userEmail) return;

      const res = await axios.get(`http://192.168.1.5:5127/api/tickets/my-tickets/${userEmail}`);
      setTickets(res.data);
    } catch (error) {
      console.error("[HISTORY] Erreur", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { 
    if (navFilter) { setFilter(navFilter as string); }
    fetchTickets(); 
  }, [initialEmail, navFilter]));

  const getStatusStyle = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes('open') || s.includes('attente') || s.includes('pending'))
      return { bg: '#ffebee', text: '#d32f2f', label: 'En attente' };
    if (s.includes('cours') || s.includes('progress'))
      return { bg: '#fff3e0', text: '#ef6c00', label: 'En cours' };
    if (s.includes('resolved') || s.includes('traité') || s.includes('accepted'))
      return { bg: '#e8f5e9', text: '#2e7d32', label: 'Traité' };
    return { bg: '#f5f5f5', text: '#666', label: status };
  };

  const filteredTickets = tickets.filter((t: any) => {
    if (filter === 'All') return true;
    const s = (t.status || "").toLowerCase();
    if (filter === 'Pending') return s.includes('open') || s.includes('pending');
    if (filter === 'Resolved') return s.includes('resolved') || s.includes('traité');
    return true;
  });

  const renderTicket = ({ item }: any) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketId}>#DT-{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
          </View>
        </View>
        <Text style={styles.ticketTitle} numberOfLines={2}>{item.summary || item.description}</Text>
        <View style={styles.ticketFooter}>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={16} color="#999" />
            <Text style={styles.userText}>Demandeur: Anas</Text>
          </View>
          <Text style={styles.dateText}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : '--/--/--'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Historique</Text>
      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterBtn, filter === 'All' && styles.activeFilter]} onPress={() => setFilter('All')}><Text style={[styles.filterBtnText, filter === 'All' && styles.activeFilterText]}>Tous</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.filterBtn, filter === 'Pending' && styles.activeFilter]} onPress={() => setFilter('Pending')}><Text style={[styles.filterBtnText, filter === 'Pending' && styles.activeFilterText]}>En attente</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.filterBtn, filter === 'Resolved' && styles.activeFilter]} onPress={() => setFilter('Resolved')}><Text style={[styles.filterBtnText, filter === 'Resolved' && styles.activeFilterText]}>Traités</Text></TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator size="large" color="#e60000" style={{ marginTop: 50 }} /> : <FlatList data={filteredTickets} keyExtractor={(item: any) => item.id.toString()} renderItem={renderTicket} ListEmptyComponent={<Text style={styles.emptyText}>Aucun ticket trouvé.</Text>} contentContainerStyle={{ paddingBottom: 20 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  filterRow: { flexDirection: 'row', marginBottom: 20 },
  filterBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
  activeFilter: { backgroundColor: '#e60000', borderColor: '#e60000' },
  filterBtnText: { color: '#666', fontSize: 13 },
  activeFilterText: { color: '#fff', fontWeight: 'bold' },
  ticketCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ticketId: { fontSize: 12, color: '#aaa' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  ticketTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f5f5f5', paddingTop: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userText: { fontSize: 12, color: '#999', marginLeft: 5 },
  dateText: { fontSize: 11, color: '#bbb' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});