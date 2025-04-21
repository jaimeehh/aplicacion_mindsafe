import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SettingItemProps {
  icon: string;
  title: string;
  href: string;
}

const SettingItem = ({ icon, title, href }: SettingItemProps) => (
  <Link href={href} asChild>
    <Pressable style={styles.settingItem}>
      <Ionicons name={icon as any} size={24} color="#007AFF" />
      <Text style={styles.settingText}>{title}</Text>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </Pressable>
  </Link>
);

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <SettingItem
        icon="person-outline"
        title="Editar Perfil"
        href="/settings/profile"
      />
      <SettingItem
        icon="notifications-outline"
        title="Notificaciones"
        href="/settings/notifications"
      />
      <SettingItem
        icon="shield-outline"
        title="Privacidad"
        href="/settings/privacy"
      />
      <SettingItem
        icon="help-circle-outline"
        title="Ayuda y Asistencia"
        href="/settings/help"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  settingText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
});
