import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Configuración',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: 'Privacidad',
          headerTintColor: '#333',
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: 'Ayuda & Asistencia',
          headerTintColor: '#333',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          headerTintColor: '#333',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Editar Perfil',
          headerTintColor: '#333',
        }}
      />
    </Stack>
  );
}