import React, { createContext, useContext, useState } from 'react';

type LanguageContextType = {
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    'notifications.loading': 'Loading...',
    'notifications.dailyReminders': 'Daily Reminders',
    'notifications.addReminder': 'Add Reminder',
    'notifications.maxReminders': 'Maximum number of reminders reached',
    'notifications.title': 'Notifications',
    'notifications.appUpdates': 'App Updates',
    'notifications.newsFeatures': 'News & Features'
  },
  es: {
    'notifications.loading': 'Cargando...',
    'notifications.dailyReminders': 'Recordatorios Diarios',
    'notifications.addReminder': 'Añadir Recordatorio',
    'notifications.maxReminders': 'Número máximo de recordatorios alcanzado',
    'notifications.title': 'Notificaciones',
    'notifications.appUpdates': 'Actualizaciones de la App',
    'notifications.newsFeatures': 'Noticias y Funciones'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'es'>('es');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}