import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSurvey } from '../stores/survey';
import { useAuth } from '../stores/auth';
import { Ionicons } from '@expo/vector-icons';

export default function ResultsScreen() {
  const { totalScore } = useSurvey();
  const { user, updateStreak } = useAuth();

  const getResultContent = () => {
    if (totalScore >= 38) {
      return {
        icon: 'checkmark-circle',
        color: '#4CAF50',
        title: 'Resultados Positivos',
        message: 'Sus respuestas indican un estado de bienestar general. Continúe con sus actividades diarias y hábitos saludables.',
      };
    } else if (totalScore >= 25) {
      return {
        icon: 'alert-circle',
        color: '#FFA726',
        title: 'Riesgo Moderado',
        message: 'Sus respuestas sugieren algunos desafíos. Considere implementar estrategias de autocuidado y mantener un registro de sus síntomas.',
      };
    } else {
      return {
        icon: 'medical',
        color: '#F44336',
        title: 'Contacte a un Especialista',
        message: 'Sus respuestas indican la necesidad de atención profesional. Le recomendamos buscar apoyo de un especialista en salud mental.',
      };
    }
  };

  const result = getResultContent();

  // Update streak when viewing results
  React.useEffect(() => {
    updateStreak();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.resultCard}>
        <Ionicons name={result.icon} size={80} color={result.color} />
        <Text style={[styles.title, { color: result.color }]}>{result.title}</Text>
        <Text style={styles.score}>Puntuación: {totalScore}/50</Text>
        <Text style={styles.message}>{result.message}</Text>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakTitle}>¡Racha Actual!</Text>
        <Text style={styles.streakCount}>{user?.streak || 0} días consecutivos</Text>
        <Text style={styles.streakMessage}>
          {user?.streak > 1 
            ? '¡Excelente compromiso! Sigue así.'
            : 'Completa el test mañana para aumentar tu racha.'}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.buttonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  streakCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  streakTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 10,
  },
  streakCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 5,
  },
  streakMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});