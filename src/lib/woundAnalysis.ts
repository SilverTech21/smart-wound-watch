import { WoundMetrics, WoundStatus, DeltaMetrics, EscalationInfo, WoundEntry } from '@/types/wound';

// Thresholds
const THRESHOLDS = {
  REDNESS_URGENT: 150,
  REDNESS_CONCERNING: 120,
  REDNESS_MONITOR: 90,
  EXUDATE_HIGH: 0.08,
  EXUDATE_MED: 0.03,
  DELTA_URGENT: 15,
  DELTA_CONCERNING: 5,
  BLUR_MIN: 60,
  BRIGHTNESS_MIN: 30,
};

export async function analyzeWoundImage(imageData: string): Promise<WoundMetrics> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Resize for consistent analysis
      const maxSize = 400;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageDataObj.data;
      const totalPixels = canvas.width * canvas.height;
      
      let rednessSum = 0;
      let rednessCount = 0;
      let brightnessSum = 0;
      let exudateCount = 0;
      
      // Analyze pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Grayscale brightness
        const gray = (r + g + b) / 3;
        brightnessSum += gray;
        
        // Redness detection: R > 1.1*G AND R > 1.1*B AND R > 70
        if (r > 1.1 * g && r > 1.1 * b && r > 70) {
          rednessSum += r;
          rednessCount++;
        }
        
        // Exudate proxy: bright pixels (potential exudate)
        if (gray > 230) {
          exudateCount++;
        }
      }
      
      const area = rednessCount;
      const areaPct = (rednessCount / totalPixels) * 100;
      const redness = rednessCount > 0 ? rednessSum / rednessCount : 0;
      const exudateRatio = exudateCount / totalPixels;
      const brightness = brightnessSum / totalPixels;
      
      // Blur detection using variance approximation
      const blurVar = calculateBlurVariance(data, canvas.width, canvas.height);
      
      resolve({
        area,
        areaPct: Math.round(areaPct * 100) / 100,
        redness: Math.round(redness * 100) / 100,
        exudateRatio: Math.round(exudateRatio * 10000) / 10000,
        brightness: Math.round(brightness * 100) / 100,
        blurVar: Math.round(blurVar * 100) / 100,
      });
    };
    img.src = imageData;
  });
}

function calculateBlurVariance(data: Uint8ClampedArray, width: number, height: number): number {
  // Simple Laplacian variance approximation
  const gray: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    gray.push((data[i] + data[i + 1] + data[i + 2]) / 3);
  }
  
  let laplacianSum = 0;
  let count = 0;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const laplacian = Math.abs(
        -4 * gray[idx] +
        gray[idx - 1] +
        gray[idx + 1] +
        gray[idx - width] +
        gray[idx + width]
      );
      laplacianSum += laplacian * laplacian;
      count++;
    }
  }
  
  return count > 0 ? laplacianSum / count : 0;
}

export function determineStatus(
  metrics: WoundMetrics,
  delta?: DeltaMetrics
): { status: WoundStatus; qualityIssue?: string } {
  // Check image quality first
  if (metrics.blurVar < THRESHOLDS.BLUR_MIN) {
    return { status: 'Monitor', qualityIssue: 'Image appears blurry. Please retake with better focus.' };
  }
  if (metrics.brightness < THRESHOLDS.BRIGHTNESS_MIN) {
    return { status: 'Monitor', qualityIssue: 'Image is too dark. Please retake with better lighting.' };
  }
  
  // Check for urgent conditions
  if (metrics.redness > THRESHOLDS.REDNESS_URGENT || metrics.exudateRatio > THRESHOLDS.EXUDATE_HIGH) {
    return { status: 'Urgent' };
  }
  
  // Check delta changes
  if (delta) {
    if (Math.abs(delta.areaPctDelta) > THRESHOLDS.DELTA_URGENT || 
        Math.abs(delta.rednessDelta) > THRESHOLDS.DELTA_URGENT) {
      return { status: 'Urgent' };
    }
    if (Math.abs(delta.areaPctDelta) > THRESHOLDS.DELTA_CONCERNING || 
        Math.abs(delta.rednessDelta) > THRESHOLDS.DELTA_CONCERNING) {
      return { status: 'Concerning' };
    }
  }
  
  // Check concerning conditions
  if (metrics.redness > THRESHOLDS.REDNESS_CONCERNING || metrics.exudateRatio > THRESHOLDS.EXUDATE_MED) {
    return { status: 'Concerning' };
  }
  
  // Check monitor conditions
  if (metrics.redness > THRESHOLDS.REDNESS_MONITOR) {
    return { status: 'Monitor' };
  }
  
  return { status: 'Stable' };
}

export function calculateDelta(current: WoundMetrics, previous: WoundMetrics): DeltaMetrics {
  return {
    areaPctDelta: Math.round((current.areaPct - previous.areaPct) * 100) / 100,
    rednessDelta: Math.round(((current.redness - previous.redness) / (previous.redness || 1)) * 100 * 100) / 100,
    exudateDelta: Math.round(((current.exudateRatio - previous.exudateRatio) / (previous.exudateRatio || 0.001)) * 100 * 100) / 100,
  };
}

export function checkEscalation(entries: WoundEntry[], currentStatus: WoundStatus): EscalationInfo {
  // Check if current is Urgent
  if (currentStatus === 'Urgent') {
    return {
      required: true,
      reason: 'Wound status is URGENT. Immediate clinical attention recommended.',
    };
  }
  
  // Check for 2 consecutive Concerning statuses
  if (currentStatus === 'Concerning' && entries.length > 0) {
    const previousEntry = entries[entries.length - 1];
    if (previousEntry.status === 'Concerning') {
      return {
        required: true,
        reason: 'Two consecutive CONCERNING statuses detected. Clinical review recommended.',
      };
    }
  }
  
  return { required: false, reason: '' };
}

// Fallback templates when LLM is unavailable
export function getTemplateInstructions(status: WoundStatus): string[] {
  const templates: Record<WoundStatus, string[]> = {
    Stable: [
      'Continue current wound care routine',
      'Change dressing as scheduled every 24-48 hours',
      'Keep the wound clean and dry',
      'Monitor for any changes in color, size, or discharge',
    ],
    Monitor: [
      'Increase wound monitoring frequency to twice daily',
      'Change dressing every 24 hours with gentle cleaning',
      'Watch for increased redness, swelling, or warmth',
      'Contact healthcare provider if symptoms worsen',
    ],
    Concerning: [
      'Clean wound immediately with saline solution',
      'Apply fresh sterile dressing and monitor closely',
      'Watch for fever, increased pain, or spreading redness',
      'Schedule appointment with healthcare provider within 24-48 hours',
    ],
    Urgent: [
      'Seek medical attention immediately',
      'Keep wound elevated if possible to reduce swelling',
      'Do not remove current dressing if heavily saturated',
      'Call emergency services if experiencing fever or severe pain',
    ],
  };
  
  return templates[status];
}

export function getTemplateSummary(metrics: WoundMetrics, status: WoundStatus, delta?: DeltaMetrics): string {
  const deltaText = delta 
    ? ` Area changed by ${delta.areaPctDelta > 0 ? '+' : ''}${delta.areaPctDelta}% from previous assessment.`
    : '';
  
  return `Wound assessment shows ${status.toLowerCase()} condition. Redness level: ${metrics.redness.toFixed(1)}, wound area: ${metrics.areaPct.toFixed(1)}%, exudate ratio: ${(metrics.exudateRatio * 100).toFixed(2)}%.${deltaText}`;
}
