import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Simulación de datos
const testResults = [
  { day: '1', score: 8 },
  { day: '2', score: 17 },
  { day: '3', score: 13 },
  { day: '4', score: 21 },
  { day: '5', score: 24 },
];

const getScoreColor = (score: number) => {
  if (score < 10) return '#4CAF50'; // Green
  if (score < 20) return '#FFA726'; // Yellow
  return '#F44336'; // Red
};

const TestResultsPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Resultados de los Tests</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: testResults.map((r) => r.day),
            datasets: [
              {
                data: testResults.map((r) => r.score),
                color: (opacity = 1) => 'transparent', // Make the default line transparent
                strokeWidth: 2,
              },
            ],
          }}
          width={Dimensions.get('window').width - 32}
          height={260}
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#fff',
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
            },
          }}
          bezier={false}
          style={styles.chart}
          withInnerLines={false}
          getDotProps={(dataPoint, index) => ({
            r: '6',
            strokeWidth: 2,
            stroke: '#fff',
            fill: getScoreColor(testResults[index].score),
          })}
          decorator={() => {
            return (
              <View>
                {/* Zone separator lines */}
                <View
                  style={[
                    styles.horizontalLine,
                    {
                      top: 260 * (1 - 10 / 25), // Position for score 10
                      borderColor: '#4CAF50',
                    },
                  ]}
                />
                <View
                  style={[
                    styles.horizontalLine,
                    {
                      top: 260 * (1 - 20 / 25), // Position for score 20
                      borderColor: '#FFA726',
                    },
                  ]}
                />

                {/* Connecting lines */}
                {testResults.map((result, index) => {
                  if (index < testResults.length - 1) {
                    const nextResult = testResults[index + 1];
                    const x =
                      index *
                        ((Dimensions.get('window').width - 32) /
                          (testResults.length - 1)) +
                      40;
                    const y = 260 - (result.score / 25) * 200;
                    const nextX =
                      (index + 1) *
                        ((Dimensions.get('window').width - 32) /
                          (testResults.length - 1)) +
                      40;
                    const nextY = 260 - (nextResult.score / 25) * 200;
                    const lineColor = getScoreColor(result.score);

                    const length = Math.sqrt(
                      Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2)
                    );
                    const angle =
                      Math.atan2(nextY - y, nextX - x) * (180 / Math.PI);

                    return (
                      <View
                        key={`line-${index}`}
                        style={[
                          styles.connectingLine,
                          {
                            left: x,
                            top: y,
                            width: length,
                            backgroundColor: lineColor,
                            transform: [{ rotate: `${angle}deg` }],
                          },
                        ]}
                      />
                    );
                  }
                  return null;
                })}
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    paddingVertical: 16,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  horizontalLine: {
    position: 'absolute',
    left: 40,
    right: 0,
    height: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  dataPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
  },
  connectingLine: {
    position: 'absolute',
    height: 2,
    transformOrigin: 'left',
  },
});

export default TestResultsPage;
