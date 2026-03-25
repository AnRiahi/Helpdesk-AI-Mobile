import { useLocalSearchParams } from 'expo-router';
import HistoryScreen from '../../screens/HistoryScreen';

export default function History() {
  const { email } = useLocalSearchParams();
  
  // DEBUG: Jarreb chouf el console dakhél VS Code, lezem talqa el email maktoub
  console.log("Email reçu dans le Proxy History:", email);

  // @ts-ignore
  return <HistoryScreen email={email as string} />;
}