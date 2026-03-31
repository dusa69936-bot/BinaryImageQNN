import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Send, ArrowLeft, RefreshCcw } from 'lucide-react-native';
import { predictDigit } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const PreviewScreen = ({ route, navigation }) => {
  const { image } = route.params;
  const [actualDigit, setActualDigit] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!actualDigit || isNaN(actualDigit)) {
      Alert.alert('Validation Error', 'Please enter a valid digit (0-9) to compare with the prediction.');
      return;
    }

    try {
      setLoading(true);
      const result = await predictDigit(image.base64, parseInt(actualDigit));
      
      navigation.navigate('Result', { 
        image: image.uri, 
        actualDigit: parseInt(actualDigit),
        prediction: result.prediction,
        success: result.result,
        accuracy: result.accuracy,
        liveAccuracy: result.live_accuracy
      });
    } catch (error) {
      Alert.alert('Prediction Failed', 'Could not connect to the backend server. Make sure the server is running and reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e1b4b', '#000000']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color="#94a3b8" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Preview Image</Text>
        </View>

        <View style={styles.imageCard}>
          <Image source={{ uri: image.uri }} style={styles.previewImage} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter Actual Digit (0-9)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={actualDigit}
            onChangeText={setActualDigit}
            maxLength={1}
            editable={!loading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.predictButton, loading && styles.disabledButton]} 
          onPress={handlePredict}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Send color="#FFFFFF" size={20} />
              <Text style={styles.predictButtonText}>Send for Classification</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <RefreshCcw color="#94a3b8" size={18} />
          <Text style={styles.retryButtonText}>Pick Different Image</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    marginTop: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  imageCard: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 20,
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  predictButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  disabledButton: {
    backgroundColor: '#4338ca',
    opacity: 0.7,
  },
  predictButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

export default PreviewScreen;
