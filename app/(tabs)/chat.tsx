import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'daily',
    content: 'Bienvenido a tu primer día. Recuerda que cada paso cuenta.',
    likes: 0,
  },
  {
    id: 2,
    type: 'experience',
    content:
      'Hace seis meses empecé a asistir a terapia. Ha sido un camino con altibajos, pero poco a poco aprendo a establecer límites y cuidar de mí misma.',
    author: 'Ana P.',
    likes: 0,
  },
];

const PREDEFINED_DAILY_MESSAGES = [
  'Hoy es un nuevo comienzo. ¡Aprovecha cada minuto!',
  'Cada día es una oportunidad para renovar tus energías.',
  'Recuerda que lo pequeño también suma.',
];

const PREDEFINED_EXPERIENCE_MESSAGES = [
  'Cada experiencia, buena o mala, te enseña algo valioso.',
  'Comparte tus vivencias; pueden ayudar a otros a encontrar su camino.',
  'Tu historia es única y poderosa.',
];

const PREDEFINED_EXPERIENCE_AUTHORS = ['María G.', 'Juan D.', 'Laura P.'];

export default function ForumScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedMessages, setLikedMessages] = useState({});

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('messages');
      if (storedMessages !== null) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages(INITIAL_MESSAGES);
        await AsyncStorage.setItem(
          'messages',
          JSON.stringify(INITIAL_MESSAGES)
        );
        const today = new Date().toISOString().split('T')[0];
        await AsyncStorage.setItem('lastDailyUpdate', today);
        await AsyncStorage.setItem('lastDailyIndex', '0');
        await AsyncStorage.setItem('lastExperienceUpdate', today);
        await AsyncStorage.setItem('lastExperienceIndex', '0');
      }
      await checkDailyUpdates();
    } catch (error) {
      console.log('Error al cargar mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkDailyUpdates = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let updated = false;
      let updatedMessages = [...messages];

      const lastDailyUpdate = await AsyncStorage.getItem('lastDailyUpdate');
      if (lastDailyUpdate !== today) {
        const lastDailyIndexStr = await AsyncStorage.getItem('lastDailyIndex');
        let lastDailyIndex = lastDailyIndexStr
          ? parseInt(lastDailyIndexStr, 10)
          : 0;
        const dailyContent =
          PREDEFINED_DAILY_MESSAGES[
            lastDailyIndex % PREDEFINED_DAILY_MESSAGES.length
          ];
        const newDailyMessage = {
          id: Date.now(),
          type: 'daily',
          content: dailyContent,
          likes: 0,
        };
        updatedMessages.push(newDailyMessage);
        await AsyncStorage.setItem('lastDailyUpdate', today);
        await AsyncStorage.setItem(
          'lastDailyIndex',
          ((lastDailyIndex + 1) % PREDEFINED_DAILY_MESSAGES.length).toString()
        );
        updated = true;
      }

      const lastExperienceUpdate = await AsyncStorage.getItem(
        'lastExperienceUpdate'
      );
      if (lastExperienceUpdate !== today) {
        const lastExperienceIndexStr = await AsyncStorage.getItem(
          'lastExperienceIndex'
        );
        let lastExperienceIndex = lastExperienceIndexStr
          ? parseInt(lastExperienceIndexStr, 10)
          : 0;
        const experienceContent =
          PREDEFINED_EXPERIENCE_MESSAGES[
            lastExperienceIndex % PREDEFINED_EXPERIENCE_MESSAGES.length
          ];
        const experienceAuthor =
          PREDEFINED_EXPERIENCE_AUTHORS[
            lastExperienceIndex % PREDEFINED_EXPERIENCE_AUTHORS.length
          ];
        const newExperienceMessage = {
          id: Date.now() + 2,
          type: 'experience',
          content: experienceContent,
          author: experienceAuthor,
          likes: 0,
        };
        updatedMessages.push(newExperienceMessage);
        await AsyncStorage.setItem('lastExperienceUpdate', today);
        await AsyncStorage.setItem(
          'lastExperienceIndex',
          (
            (lastExperienceIndex + 1) %
            PREDEFINED_EXPERIENCE_MESSAGES.length
          ).toString()
        );
        updated = true;
      }

      if (updated) {
        setMessages(updatedMessages);
        await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
      }
    } catch (error) {
      console.log('Error en la actualización diaria:', error);
    }
  };

  const handleLike = (messageId) => {
    if (likedMessages[messageId]) return;
    setLikedMessages((prev) => ({ ...prev, [messageId]: true }));
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, likes: (msg.likes || 0) + 1 } : msg
      )
    );
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const getMessageData = (type) => {
    switch (type) {
      case 'daily':
        return { title: 'Mensaje diario 🌞', titleStyle: styles.dailyTitle };
      case 'experience':
        return {
          title: 'Experiencia personal 💬',
          titleStyle: styles.experienceTitle,
        };
      default:
        return {};
    }
  };

  const renderItem = ({ item }) => {
    const { title, titleStyle } = getMessageData(item.type);
    return (
      <View style={styles.messageContainer}>
        <Text style={[styles.messageTitle, titleStyle]}>{title}</Text>
        <Text style={styles.contentText}>{item.content}</Text>
        {item.author && <Text style={styles.authorText}>- {item.author}</Text>}
        <View style={styles.likeContainer}>
          <TouchableOpacity onPress={() => handleLike(item.id)}>
            <Ionicons
              name={likedMessages[item.id] ? 'heart' : 'heart-outline'}
              size={24}
              color={likedMessages[item.id] ? '#E91E63' : '#999'}
            />
          </TouchableOpacity>
          <Text style={styles.likesCount}>{item.likes || 0}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Cargando mensajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4285F4',
  },
  listContent: {
    paddingBottom: 16,
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dailyTitle: {
    color: '#FF9800',
  },
  experienceTitle: {
    color: '#5792F8',
  },
  contentText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  likesCount: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
});
