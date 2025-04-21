import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurvey } from '../../stores/survey';
import { useAuth } from '../../stores/auth';

const SURVEY_QUESTIONS = [
  "¿Cómo calificaría su nivel de ansiedad hoy?",
  "¿Qué tan intensos han sido sus pensamientos negativos?",
  "¿Ha experimentado dificultad para dormir?",
  "¿Qué tan fuerte ha sido su fatiga o pérdida de energía?",
  "¿Ha tenido dificultad para concentrarse?",
  "¿Cómo calificaría su estado de ánimo general?",
  "¿Ha experimentado cambios en su apetito?",
  "¿Qué tan intensos han sido sus síntomas físicos?",
  "¿Ha tenido pensamientos de desesperanza?",
  "¿Qué tan afectada se ha visto su rutina diaria?"
];

const ANSWER_OPTIONS = [
  'Ausente',
  'Leve',
  'Moderado',
  'Grave',
  'Muy grave/Incapacitante'
];

const MEME_IMAGES = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500', // Imagen relajante
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500', // Naturaleza serena
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500', // Amanecer motivador
  'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=500', // Sonrisa inspiradora
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500'  // Vista de montaña
];

export default function SurveyScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { submitAnswer, isCompleted, selectedAnswer, setSelectedAnswer, answers } = useSurvey();
  const { user, incrementTestsCompleted } = useAuth();

  // Estados para los modales
  const [showTestUnavailableModal, setShowTestUnavailableModal] = useState(false);
  const [nextAvailable, setNextAvailable] = useState<Date | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  // Determina si se puede realizar el test hoy
  const canTakeTest = () => {
    if (!user?.lastTestDate) return true;
    const lastTestDate = new Date(user.lastTestDate).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return lastTestDate !== today;
  };

  useEffect(() => {
    if (!canTakeTest()) {
      const lastTest = new Date(user.lastTestDate);
      const available = new Date(lastTest);
      available.setDate(available.getDate() + 1);
      setNextAvailable(available);
      setShowTestUnavailableModal(true);
    }
  }, []);

  const handleAnswer = (score: number) => {
    setSelectedAnswer(score);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
    }
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      submitAnswer(currentQuestion, selectedAnswer);
      if (currentQuestion < SURVEY_QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(answers[currentQuestion + 1] ?? null);
      }
    }
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  // Al completar, incrementamos el contador de tests completados
  useEffect(() => {
    if (isCompleted) {
      incrementTestsCompleted();
    }
  }, [isCompleted]);

  // Selección de meme/mensaje motivacional basado en la fecha
  const todayMeme = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return MEME_IMAGES[dayOfYear % MEME_IMAGES.length];
  }, []);

  if (isCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.completionCard}>
          <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
          <Text style={styles.title}>Encuesta Completada</Text>
          <Text style={styles.subtitle}>Gracias por sus respuestas.</Text>
          <Image source={{ uri: todayMeme }} style={styles.memeImage} />
          <TouchableOpacity
            style={styles.resultButton}
            onPress={() => router.push('/results')}
          >
            <Text style={styles.resultButtonText}>Ver Resultados</Text>
          </TouchableOpacity>
        </View>
        {/* Sección de estadísticas en la pantalla final (opcional) */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user?.streak || 0}</Text>
            <Text style={styles.statLabel}>Racha Actual</Text>
            {user?.highestStreak ? (
              <Text style={styles.recordText}>Record: {user.highestStreak}</Text>
            ) : null}
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user?.testsCompleted || 0}</Text>
            <Text style={styles.statLabel}>Tests Completados</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modal: Test no disponible */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTestUnavailableModal}
        onRequestClose={() => setShowTestUnavailableModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Test no disponible</Text>
            {nextAvailable && (
              <Text style={styles.modalText}>
                Ya ha completado el test hoy. El próximo test estará disponible el{' '}
                {nextAvailable.toLocaleDateString()} a las{' '}
                {nextAvailable.toLocaleTimeString()}.
              </Text>
            )}
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setShowTestUnavailableModal(false);
                router.push('/(tabs)/results');
              }}
            >
              <Text style={styles.modalButtonText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal: Confirmar salida */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showExitModal}
        onRequestClose={() => setShowExitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¿Salir del test?</Text>
            <Text style={styles.modalText}>
              Si sale ahora, perderá su progreso actual.
            </Text>
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowExitModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.destructiveButton]}
                onPress={() => {
                  setShowExitModal(false);
                  router.push('/(tabs)');
                }}
              >
                <Text style={styles.modalButtonText}>Salir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cabecera */}
      <View style={styles.header}>
        {currentQuestion === 0 ? (
          <TouchableOpacity onPress={handleExit}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handlePrevious}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Pregunta {currentQuestion + 1}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / SURVEY_QUESTIONS.length) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(((currentQuestion + 1) / SURVEY_QUESTIONS.length) * 100)}%
        </Text>
      </View>

      {/* Tarjeta de la pregunta */}
      <View style={styles.questionCard}>
        <Text style={styles.questionCategory}>Evaluación Diaria</Text>
        <Text style={styles.question}>{SURVEY_QUESTIONS[currentQuestion]}</Text>
      </View>

      {/* Opciones de respuesta */}
      <Text style={styles.selectionText}>Seleccione una opción</Text>
      {ANSWER_OPTIONS.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            selectedAnswer === index && styles.optionButtonSelected,
          ]}
          onPress={() => handleAnswer(index)}
        >
          <View style={styles.optionContent}>
            <View
              style={[
                styles.radioOuter,
                selectedAnswer === index && styles.radioOuterSelected,
              ]}
            >
              {selectedAnswer === index && <View style={styles.radioInner} />}
            </View>
            <Text
              style={[
                styles.optionText,
                selectedAnswer === index && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Botón Siguiente/Finalizar */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedAnswer === null && styles.nextButtonDisabled,
        ]}
        onPress={handleNext}
        disabled={selectedAnswer === null}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestion === SURVEY_QUESTIONS.length - 1
            ? 'Finalizar'
            : 'Siguiente pregunta'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4285F4',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: 'bold',
  },
  questionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  questionCategory: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '700',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 20,
  },
  selectionText: {
    fontSize: 15,
    color: '#666',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 8,
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionButtonSelected: {
    backgroundColor: '#f0f7ff',
    borderColor: '#4285F4',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: '#4285F4',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4285F4',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  optionTextSelected: {
    color: '#4285F4',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#4285F4',
    marginHorizontal: 15,
    marginVertical: 15,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  completionCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  resultButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  resultButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 10,
  },
  statBox: {
    backgroundColor: '#f0f7ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  recordText: {
    fontSize: 13,
    color: '#4285F4',
    fontWeight: '600',
    marginTop: 5,
  },
  memeImage: {
    width: 250,
    height: 150,
    borderRadius: 10,
    marginVertical: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
  },
});
