import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../stores/auth';
import { LanguageProvider } from '../context/LanguageContext';

export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  return (
    <LanguageProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="terms" options={{ headerShown: false }} />
            </>
          ) : (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="awards" options={{ headerShown: false }} />
            </>
          )}
        </Stack>
        <StatusBar style="auto" />
      </>
    </LanguageProvider>
  );
}
