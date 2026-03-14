import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ComingSoonScreen({ route, navigation }: any) {
  const { role } = route.params;
  return (
    <View style={styles.container}>
      <Ionicons name="construct-outline" size={100} color="#004aad" />
      <Text style={styles.title}>Espace {role}</Text>
      <Text style={styles.subtitle}>Interface en cours de développement (Sprint 5).</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}><Text style={styles.btnText}>Retour</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', margin: 10 },
  btn: { marginTop: 20, padding: 12, backgroundColor: '#eee', borderRadius: 8 },
  btnText: { color: '#004aad', fontWeight: 'bold' }
});