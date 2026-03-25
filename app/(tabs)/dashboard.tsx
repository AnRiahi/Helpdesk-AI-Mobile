import { useLocalSearchParams } from 'expo-router';
import DashboardScreen from '../../screens/DashboardScreen';

export default function Page() {
  const { email } = useLocalSearchParams();
  
  // ✅ On passe l'email reçu au composant réel
  return <DashboardScreen email={email as string} />;
}