import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Recolección y Uso de Datos</Text>
        <Text style={styles.text}>
          Recopilamos y procesamos tus datos personales para proveer y mejorar nuestros servicios. Esto incluye:
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• Información del perfil que proporcionas</Text>
          <Text style={styles.bulletPoint}>• Datos de uso y preferencias</Text>
          <Text style={styles.bulletPoint}>• Información del dispositivo y configuraciones</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Tus Derechos de Privacidad</Text>
        <Text style={styles.text}>
          Tienes derecho a:
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• Acceder a tus datos personales</Text>
          <Text style={styles.bulletPoint}>• Solicitar la eliminación de datos</Text>
          <Text style={styles.bulletPoint}>• Oponerte a la recopilación de datos</Text>
          <Text style={styles.bulletPoint}>• Actualizar tus preferencias</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Seguridad de los Datos</Text>
        <Text style={styles.text}>
          Implementamos medidas de seguridad estándar en la industria para proteger tu información personal de accesos no autorizados, divulgación o mal uso.
        </Text>
      </View>
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
    marginBottom: 12,
    color: '#1a1a1a',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a4a4a',
    marginBottom: 12,
  },
  bulletPoints: {
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a4a4a',
    marginBottom: 8,
    paddingLeft: 8,
  },
});
