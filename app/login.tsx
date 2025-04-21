import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../stores/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'family'>('patient');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      setError('');
      await signIn(email, password, role);
      router.replace('/terms');
    } catch (err) {
      setError('Email inválido o contraseña');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?w=500' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Bienvenido!</Text>
      <Text style={styles.subtitle}>Inicia sesión para ser parte de esta comunidad</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Introduce usuario"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Introduce contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'patient' && styles.roleButtonSelected]}
          onPress={() => setRole('patient')}
        >
          <Text style={[styles.roleText, role === 'patient' && styles.roleTextSelected]}>
            Paciente
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'family' && styles.roleButtonSelected]}
          onPress={() => setRole('family')}
        >
          <Text style={[styles.roleText, role === 'family' && styles.roleTextSelected]}>
            Familiar
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Contraseña olvidada?</Text>
      </TouchableOpacity>

      <View style={styles.termsContainer}>
        <TouchableOpacity
          style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          {termsAccepted && <Text style={styles.checkboxText}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.termsText}>Acepto los Términos y Condiciones de uso</Text>
      </View>
      
      <TouchableOpacity
        style={[styles.button, !termsAccepted && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!termsAccepted}
      >
        <Text style={styles.buttonText}>Inicia Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  roleText: {
    fontSize: 14,
    color: '#666',
  },
  roleTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4285F4',
    fontSize: 14,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4285F4',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4285F4',
  },
  checkboxText: {
    color: '#fff',
    fontSize: 14,
  },
  termsText: {
    color: '#666',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 15,
  },
});