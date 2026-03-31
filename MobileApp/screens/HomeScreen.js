import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, Camera, PenTool, X, Check } from 'lucide-react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const signatureRef = useRef();

  const handleSignature = (signature) => {
    // Signature is a base64 encoded image string
    setModalVisible(false);
    // Since our backend in api.js appends "data:image/png;base64,", we extract the raw bytes:
    const base64Data = signature.replace("data:image/png;base64,", "");
    navigation.navigate('Preview', { image: { uri: signature, base64: base64Data } });
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your gallery to pick an image.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        navigation.navigate('Preview', { image: result.assets[0] });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your camera to take a photo.');
      return;
    }

    try {
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        navigation.navigate('Preview', { image: result.assets[0] });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e1b4b', '#000000']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
        <Text style={styles.title}>Binary Image Classification {"\n"} Using Machine Learning {"\n"} and Deep Quantum Neural Networks</Text>
        <Text style={styles.subtitle}>Classify handwritten digits accurately</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.drawButton]} onPress={() => setModalVisible(true)} disabled={loading}>
          <PenTool color="#1e293b" size={24} />
          <Text style={[styles.buttonText, {color: '#1e293b'}]}>Draw Digit (Handwritten)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImage} disabled={loading}>
          <ImageIcon color="#FFFFFF" size={24} />
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={takePhoto} disabled={loading}>
          <Camera color="#FFFFFF" size={24} />
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
           <View style={styles.modalHeader}>
             <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#ef4444" size={28} />
             </TouchableOpacity>
             <Text style={styles.modalTitle}>Draw a Digit</Text>
             <TouchableOpacity onPress={() => signatureRef.current.readSignature()}>
                <Check color="#22c55e" size={28} />
             </TouchableOpacity>
           </View>
           <View style={styles.canvasWrapper}>
             <SignatureScreen
                ref={signatureRef}
                onOK={handleSignature}
                penColor="#ffffff"
                backgroundColor="#000000"
                minWidth={12}
                maxWidth={16}
                webStyle={`
                  .m-signature-pad { background-color: #000000; box-shadow: none; border: none; }
                  .m-signature-pad--body { background-color: #000000; }
                  .m-signature-pad--body canvas { background-color: #000000; } 
                  .m-signature-pad--footer { display: none; margin: 0px; }
                  body,html { width: 100%; height: 100%; background-color: #000000; margin: 0; padding: 0; }
                `}
             />
           </View>
        </SafeAreaView>
      </Modal>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Select a clear image of a handwritten digit (0-9).</Text>
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  secondaryButton: {
    backgroundColor: '#475569',
  },
  drawButton: {
    backgroundColor: '#38bdf8', // Light blue
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1e293b',
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 'bold',
  },
  canvasWrapper: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 10,
    marginBottom: 50,
    borderWidth: 2,
    borderColor: '#38bdf8',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },

  loaderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default HomeScreen;
