import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../stores/auth';
import Logo from '../../assets/images/LOGO.png';

export default function HomeScreen() {
  const { user, canTakeTest } = useAuth();

  const handleTestPress = () => {
    if (user?.role === 'family') {
      if (user.lastTestDate) {
        router.push('/results');
      } else {
        router.push('/test-not-completed');
      }
    } else {
      router.push('/survey');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={Logo} style={styles.logo} />

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>¡Bienvenido de nuevo!</Text>
        <Text style={styles.welcomeText}>
          {user?.role === 'family'
            ? 'Monitorea el progreso y bienestar de tu familiar.'
            : 'Tu bienestar es nuestra prioridad.'}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          //!canTakeTest() && styles.startButtonDisabled
        ]}
        onPress={handleTestPress}
      >
        <Text style={styles.startButtonText}>
          {user?.role === 'family' ? 'Ver Test Diario' : 'Comenzar Test Diario'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 180,
    marginTop: 40,
    marginLeft: 135,
  },
  welcomeContainer: {
    width: '100%',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  startButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: '100%',
  },
  startButtonDisabled: {
    backgroundColor: '#A4C2F4',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
