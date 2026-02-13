export interface MeterData {
  inputKwh: number;
  outputKwh: number;
  timestamp: Date;
}

export interface TheftAnalysis {
  isTheft: boolean;
  isSuspicious: boolean;
  lossPercentage: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  reason: string;
}

/**
 * IMO Model - Input Minus Output Model
 * Calculates technical and non-technical losses
 */
export function analyzeTheft(data: MeterData, expectedTechnicalLoss: number = 8): TheftAnalysis {
  const { inputKwh, outputKwh } = data;

  // Calculate total loss percentage
  const totalLoss = ((inputKwh - outputKwh) / inputKwh) * 100;
  
  // Calculate non-technical loss (potential theft)
  const nonTechnicalLoss = totalLoss - expectedTechnicalLoss;

  // Determine severity and classification
  let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let isTheft = false;
  let isSuspicious = false;
  let confidence = 0;
  let reason = '';

  if (totalLoss < 5) {
    severity = 'LOW';
    confidence = 95;
    reason = 'Normal consumption pattern. Loss within acceptable range.';
  } else if (totalLoss >= 5 && totalLoss < 12) {
    severity = 'LOW';
    isSuspicious = false;
    confidence = 85;
    reason = 'Slightly elevated loss, likely technical. Monitoring recommended.';
  } else if (totalLoss >= 12 && totalLoss < 20) {
    severity = 'MEDIUM';
    isSuspicious = true;
    confidence = 75;
    reason = 'Suspicious loss pattern detected. Investigation recommended.';
  } else if (totalLoss >= 20 && totalLoss < 30) {
    severity = 'HIGH';
    isTheft = true;
    isSuspicious = true;
    confidence = 85;
    reason = 'High probability of electricity theft. Immediate inspection required.';
  } else {
    severity = 'CRITICAL';
    isTheft = true;
    isSuspicious = true;
    confidence = 95;
    reason = 'Critical theft detected. Urgent action required.';
  }

  return {
    isTheft,
    isSuspicious,
    lossPercentage: parseFloat(totalLoss.toFixed(2)),
    severity,
    confidence,
    reason,
  };
}

/**
 * Anomaly Detection using statistical analysis
 * Compares current reading with historical average
 */
export function detectAnomaly(
  currentReading: MeterData,
  historicalReadings: MeterData[]
): { isAnomaly: boolean; deviationPercent: number } {
  if (historicalReadings.length < 3) {
    return { isAnomaly: false, deviationPercent: 0 };
  }

  // Calculate average loss from historical data
  const avgLoss = historicalReadings.reduce((sum, reading) => {
    const loss = ((reading.inputKwh - reading.outputKwh) / reading.inputKwh) * 100;
    return sum + loss;
  }, 0) / historicalReadings.length;

  // Calculate standard deviation
  const variance = historicalReadings.reduce((sum, reading) => {
    const loss = ((reading.inputKwh - reading.outputKwh) / reading.inputKwh) * 100;
    return sum + Math.pow(loss - avgLoss, 2);
  }, 0) / historicalReadings.length;
  
  const stdDev = Math.sqrt(variance);

  // Current loss
  const currentLoss = ((currentReading.inputKwh - currentReading.outputKwh) / currentReading.inputKwh) * 100;

  // Check if current reading deviates significantly (more than 2 standard deviations)
  const deviation = Math.abs(currentLoss - avgLoss);
  const isAnomaly = deviation > (2 * stdDev);
  const deviationPercent = ((deviation / avgLoss) * 100);

  return { isAnomaly, deviationPercent: parseFloat(deviationPercent.toFixed(2)) };
}

/**
 * Time-based pattern analysis
 * Detects unusual consumption patterns at specific times
 */
export function analyzeTimePattern(readings: MeterData[]): {
  hasNightAnomaly: boolean;
  hasPeakAnomaly: boolean;
} {
  if (readings.length < 24) {
    return { hasNightAnomaly: false, hasPeakAnomaly: false };
  }

  // Separate night hours (12 AM - 6 AM) and peak hours (6 PM - 10 PM)
  const nightReadings = readings.filter(r => {
    const hour = r.timestamp.getHours();
    return hour >= 0 && hour < 6;
  });

  const peakReadings = readings.filter(r => {
    const hour = r.timestamp.getHours();
    return hour >= 18 && hour < 22;
  });

  // Calculate average consumption
  const avgNight = nightReadings.reduce((sum, r) => sum + r.outputKwh, 0) / nightReadings.length;
  const avgPeak = peakReadings.reduce((sum, r) => sum + r.outputKwh, 0) / peakReadings.length;
  const avgOverall = readings.reduce((sum, r) => sum + r.outputKwh, 0) / readings.length;

  // Night consumption should be lower than average
  const hasNightAnomaly = avgNight > avgOverall * 1.2;

  // Peak consumption should be higher than average
  const hasPeakAnomaly = avgPeak < avgOverall * 0.8;

  return { hasNightAnomaly, hasPeakAnomaly };
}
