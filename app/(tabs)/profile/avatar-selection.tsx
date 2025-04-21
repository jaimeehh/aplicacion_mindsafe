import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../stores/auth';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 16;
const itemWidth = (width - gap * (numColumns + 1)) / numColumns;

export default function AvatarSelectionScreen() {
  const router = useRouter();
  const { selectedAvatar, setSelectedAvatar, availableAvatars, unlockedAvatars, user } = useAuth();
  const [tempSelectedAvatar, setTempSelectedAvatar] = useState(selectedAvatar);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [selectedLockedAvatar, setSelectedLockedAvatar] = useState(null);

  const handleAvatarPress = (avatar) => {
    if (unlockedAvatars.includes(avatar.id)) {
      setTempSelectedAvatar(avatar);
    } else {
      setSelectedLockedAvatar(avatar);
      setShowLockedModal(true);
    }
  };

  const handleSave = () => {
    if (tempSelectedAvatar) {
      setSelectedAvatar(tempSelectedAvatar);
      router.push('/(tabs)/profile');
    }
  };

  const getAvatarStatus = (avatar) => {
    if (unlockedAvatars.includes(avatar.id)) {
      return {
        unlocked: true,
        message: 'Disponible'
      };
    }
    
    switch (avatar.unlockCondition) {
      case '30_DAYS_STREAK':
        return {
          unlocked: false,
          message: `Racha de 30 días (${user?.streak || 0}/30)`
        };
      case '3_MONTHS':
        const joinDate = new Date(user?.joinDate || Date.now());
        const monthsActive = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
        return {
          unlocked: false,
          message: `3 meses de actividad (${monthsActive}/3)`
        };
      default:
        return {
          unlocked: false,
          message: 'Bloqueado'
        };
    }
  };

  const renderItem = ({ item }) => {
    const status = getAvatarStatus(item);
    const isLocked = !status.unlocked;

    return (
      <TouchableOpacity
        style={[
          styles.avatarItem,
          tempSelectedAvatar?.id === item.id && styles.selectedAvatarItem,
          isLocked && styles.lockedAvatarItem,
        ]}
        onPress={() => handleAvatarPress(item)}
      >
        <View style={styles.avatarImageContainer}>
          <Image 
            source={{ uri: item.url }} 
            style={[
              styles.avatarImage,
              isLocked && styles.lockedAvatarImage,
            ]} 
          />
          {isLocked && (
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={24} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.avatarName}>{item.name}</Text>
        <Text style={[
          styles.avatarStatus,
          status.unlocked ? styles.unlockedStatus : styles.lockedStatus
        ]}>
          {status.message}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Elige tu avatar</Text>
      </View>

      <FlatList
        data={availableAvatars}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContainer}
      />

      <TouchableOpacity 
        style={[
          styles.saveButton,
          !tempSelectedAvatar && styles.saveButtonDisabled
        ]} 
        onPress={handleSave}
        disabled={!tempSelectedAvatar}
      >
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      <Modal
        visible={showLockedModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLockedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image 
              source={{ uri: selectedLockedAvatar?.url }} 
              style={styles.modalAvatar} 
            />
            <Text style={styles.modalTitle}>{selectedLockedAvatar?.name}</Text>
            <Text style={styles.modalDescription}>
              {selectedLockedAvatar?.description}
            </Text>
            <Text style={styles.unlockRequirement}>
              Requisito para desbloquear:
            </Text>
            <Text style={styles.unlockCondition}>
              {selectedLockedAvatar?.unlockRequirementText}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowLockedModal(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  gridContainer: {
    padding: gap,
  },
  avatarItem: {
    width: itemWidth,
    margin: gap / 2,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarItem: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  lockedAvatarItem: {
    opacity: 0.8,
    backgroundColor: '#f0f0f0',
  },
  avatarImageContainer: {
    position: 'relative',
    width: itemWidth - 32,
    height: itemWidth - 32,
    marginBottom: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: (itemWidth - 32) / 2,
  },
  lockedAvatarImage: {
    opacity: 0.5,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: (itemWidth - 32) / 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 4,
  },
  avatarStatus: {
    fontSize: 12,
    textAlign: 'center',
  },
  unlockedStatus: {
    color: '#4CAF50',
  },
  lockedStatus: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  unlockRequirement: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  unlockCondition: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});