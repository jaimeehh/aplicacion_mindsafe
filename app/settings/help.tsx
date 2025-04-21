import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: '¿Cómo restablezco mi contraseña?',
    answer:
      'Para restablecer tu contraseña, dirígete a la pantalla de Login y selecciona “Contraseña olvidada”. Luego, sigue las instrucciones enviadas a tu correo.',
  },
  {
    question: '¿Cómo puedo actualizar mi perfil?',
    answer:
      'Puedes actualizar tu perfil desde la sección “Perfil” en la barra inferior. Allí podrás modificar tus datos personales y preferencias.',
  },
  {
    question: '¿Dónde puedo gestionar las notificaciones?',
    answer:
      'Accede a la pantalla “Notificaciones” en el menú de configuración para activar, desactivar o programar tus recordatorios diarios.',
  },
];

export default function HelpScreen() {
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleToggleFAQ = (index: number) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  const handleEmailSupport = () => {
    setShowSupportModal(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Preguntas Frecuentes</Text>
        {faqs.map((faq, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.faqItem}
              onPress={() => handleToggleFAQ(index)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
            {openQuestionIndex === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Contactar Soporte</Text>
        <TouchableOpacity style={styles.contactOption} onPress={handleEmailSupport}>
          <Ionicons name="mail-outline" size={24} color="#007AFF" />
          <Text style={styles.contactText}>Soporte por Email</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para mostrar la información de soporte */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSupportModal}
        onRequestClose={() => setShowSupportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Soporte por Email</Text>
            <Text style={styles.modalText}>
              Puedes escribirnos a: soporte@ejemplo.com
            </Text>
            <Text style={styles.modalText}>
              ¡Estamos aquí para ayudarte!
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setShowSupportModal(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqQuestion: {
    fontSize: 16,
    color: '#4a4a4a',
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
    lineHeight: 20,
    paddingLeft: 10,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactText: {
    fontSize: 16,
    color: '#4a4a4a',
    marginLeft: 12,
  },
  // Estilos para el Modal
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  modalText: {
    fontSize: 16,
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
