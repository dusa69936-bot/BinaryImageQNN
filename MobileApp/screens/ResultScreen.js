import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { CheckCircle2, XCircle, Home, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ResultScreen = ({ route, navigation }) => {
  const { image, actualDigit, prediction, success, accuracy, liveAccuracy } = route.params;

  return (
    <LinearGradient colors={['#0f172a', '#1e1b4b', '#000000']} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
        <Text style={styles.title}>Binary Image Classification {"\n"} Using Machine Learning {"\n"} and Deep Quantum Neural Networks</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {success ? (
            <CheckCircle2 color="#22c55e" size={80} />
          ) : (
            <XCircle color="#ef4444" size={80} />
          )}
        </View>

        <Text style={[styles.statusText, { color: success ? '#22c55e' : '#ef4444' }]}>
          {success ? 'Correct Prediction!' : 'Incorrect Prediction'}
        </Text>

        <View style={styles.resultCard}>
          <Image source={{ uri: image }} style={styles.resultImage} />
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Actual</Text>
              <Text style={styles.statValue}>{actualDigit}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Predicted</Text>
              <Text style={[styles.statValue, { color: success ? '#22c55e' : '#ef4444' }]}>
                {prediction === -1 ? 'Err' : prediction}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Accuracy</Text>
              <Text style={[styles.statValue, { color: '#38bdf8' }]}>
                {accuracy !== undefined ? `${accuracy}%` : '--'}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Live Acc</Text>
              <Text style={[styles.statValue, { color: '#a855f7' }]}>
                {liveAccuracy !== undefined ? `${liveAccuracy}%` : '--'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.explanation}>
          {success 
            ? `The QNN correctly identified the digit as ${prediction}.` 
            : `The QNN predicted ${prediction}, but you expected ${actualDigit}.`}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={() => navigation.popToTop()}
          >
            <Home color="#ffffff" size={20} />
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.homeButton, styles.retryButton]} 
            onPress={() => navigation.goBack()}
          >
            <RefreshCw color="#ffffff" size={20} />
            <Text style={styles.homeButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 5,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  resultCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  resultImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 24,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
  },
  explanation: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    padding: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  retryButton: {
    backgroundColor: '#475569',
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultScreen;
