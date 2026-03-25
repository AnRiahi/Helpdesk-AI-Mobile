import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#e60000', 
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        
        // ✅ Na77iw el labels ken t7eb juste icons nḍafa (Ikhtiyari)
        tabBarShowLabel: true, 

        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0, // Na77iw el khat el r9i9
          height: Platform.OS === 'ios' ? 85 : 65, 
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          
          // ✅ Design Modern: Floating Tab Bar
          position: 'absolute',
          bottom: 15,
          left: 15,
          right: 15,
          borderRadius: 25,
          
          // ✅ Shadow Pro
          elevation: 15, // Android
          shadowColor: '#000', // iOS
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        }
      }}
    >
      {/* 1. Dashboard */}
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Accueil', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ) 
        }} 
      />

      {/* 2. Assistant - N-roddouh m-3allaq chwaya (Central Button Effect) */}
      <Tabs.Screen 
        name="assistant" 
        options={{ 
          title: 'AI Chat', 
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#e6000015' : 'transparent',
              padding: 8,
              borderRadius: 15,
            }}>
              <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={26} color={color} />
            </View>
          ) 
        }} 
      />

      {/* 3. Historique */}
      <Tabs.Screen 
        name="history" 
        options={{ 
          title: 'Tickets', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "list" : "list-outline"} size={22} color={color} />
          ) 
        }} 
      />

      {/* --- SCREENS KHABBINEHOM --- */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="verify" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
      <Tabs.Screen name="comingsoon" options={{ href: null }} />

    </Tabs>
  );
}