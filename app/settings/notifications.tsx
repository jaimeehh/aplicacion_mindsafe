import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Reminder = {
  id: string;
  time: Date;
  enabled: boolean;
};

const REMINDERS_STORAGE_KEY = '@app_reminders';

const hoursArray = Array.from({ length: 24 }, (_, i) => i);
const minutesArray = Array.from({ length: 60 }, (_, i) => i);

export default function NotificationsScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para mostrar el picker de horas/minutos
  const [showTimeSelector, setShowTimeSelector] = useState<string | null>(null);
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);

  useEffect(() => {
    loadStoredReminders();
  }, []);

  const loadStoredReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (storedReminders) {
        const parsedReminders = JSON.parse(storedReminders).map((reminder: any) => ({
          ...reminder,
          time: new Date(reminder.time),
        }));
        setReminders(parsedReminders);
      } else {
        // Set default reminder if none exists
        const defaultReminder = {
          id: '1',
          time: new Date(),
          enabled: true,
        };
        setReminders([defaultReminder]);
        await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify([defaultReminder]));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveReminders = async (updatedReminders: Reminder[]) => {
    try {
      const remindersToStore = updatedReminders.map(reminder => ({
        ...reminder,
        time: reminder.time.toISOString(),
      }));
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(remindersToStore));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const addReminder = async () => {
    if (reminders.length >= 5) return;

    // Por defecto, se crea un recordatorio con la hora 00:00
    const newTime = new Date();
    newTime.setHours(0, 0, 0, 0);

    const newReminder = {
      id: Date.now().toString(),
      time: newTime,
      enabled: true,
    };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
  };

  const deleteReminder = async (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
  };

  const toggleReminder = async (id: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id
        ? { ...reminder, enabled: !reminder.enabled }
        : reminder
    );
    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
  };

  // Actualiza la hora del recordatorio
  const updateReminderTime = async (id: string, hours: number, minutes: number) => {
    const newTime = new Date();
    newTime.setHours(hours, minutes, 0, 0);

    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, time: newTime } : reminder
    );
    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
  };

  // Maneja la confirmación de la hora seleccionada
  const handleConfirmTime = (id: string) => {
    updateReminderTime(id, selectedHours, selectedMinutes);
    setShowTimeSelector(null);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Cargando recordatorios...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Recordatorios Diarios</Text>
        
        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderItem}>
            <View style={styles.reminderHeader}>
              <Switch
                value={reminder.enabled}
                onValueChange={() => toggleReminder(reminder.id)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={reminder.enabled ? '#007AFF' : '#f4f3f4'}
              />
              <TouchableOpacity
                style={[styles.timeButton, !reminder.enabled && styles.disabled]}
                onPress={() => {
                  // Cargar hora/minuto actuales del recordatorio
                  setSelectedHours(reminder.time.getHours());
                  setSelectedMinutes(reminder.time.getMinutes());
                  setShowTimeSelector(reminder.id);
                }}
                disabled={!reminder.enabled}
              >
                <Text style={styles.timeText}>
                  {reminder.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteReminder(reminder.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>

            {/* Interfaz para seleccionar hora/minutos */}
            {showTimeSelector === reminder.id && (
              <View style={styles.timeSelectorContainer}>
                <View style={styles.pickerRow}>
                  <ScrollView style={styles.pickerColumn}>
                    {hoursArray.map(h => (
                      <TouchableOpacity
                        key={h}
                        onPress={() => setSelectedHours(h)}
                        style={[
                          styles.pickerItem,
                          selectedHours === h && styles.pickerItemSelected
                        ]}
                      >
                        <Text style={styles.pickerItemText}>{String(h).padStart(2, '0')}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.pickerSeparator}>:</Text>

                  <ScrollView style={styles.pickerColumn}>
                    {minutesArray.map(m => (
                      <TouchableOpacity
                        key={m}
                        onPress={() => setSelectedMinutes(m)}
                        style={[
                          styles.pickerItem,
                          selectedMinutes === m && styles.pickerItemSelected
                        ]}
                      >
                        <Text style={styles.pickerItemText}>{String(m).padStart(2, '0')}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleConfirmTime(reminder.id)}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {reminders.length < 5 && (
          <TouchableOpacity style={styles.addButton} onPress={addReminder}>
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.addButtonText}>Añadir Recordatorio</Text>
          </TouchableOpacity>
        )}

        {reminders.length >= 5 && (
          <Text style={styles.maxRemindersText}>
            Se ha alcanzado el máximo de recordatorios.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  reminderItem: {
    marginBottom: 16,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  timeButton: {
    flex: 1,
    marginHorizontal: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  timeText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
  },
  maxRemindersText: {
    textAlign: 'center',
    color: '#FF3B30',
    marginTop: 8,
  },

  /* Estilos del Picker personalizado */
  timeSelectorContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerColumn: {
    width: 60,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  pickerSeparator: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  pickerItem: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemSelected: {
    backgroundColor: '#007AFF',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
