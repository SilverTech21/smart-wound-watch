import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WoundEntry, WoundMetrics, PatientContext, AnalysisResult } from '@/types/wound';
import {
  analyzeWoundImage,
  determineStatus,
  calculateDelta,
  checkEscalation,
  getTemplateInstructions,
  getTemplateSummary,
} from '@/lib/woundAnalysis';
import {
  getCurrentPatientId,
  getPatientEntries,
  addWoundEntry,
} from '@/lib/storage';

export function useWoundAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeWound = async (
    imageData: string,
    patientContext: PatientContext
  ): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Step 1: Run perception module
      const metrics = await analyzeWoundImage(imageData);
      
      // Step 2: Get previous entries for comparison
      const patientId = getCurrentPatientId();
      const previousEntries = getPatientEntries(patientId);
      const latestEntry = previousEntries.length > 0 
        ? previousEntries[previousEntries.length - 1] 
        : undefined;
      
      // Step 3: Calculate delta if we have previous data
      const delta = latestEntry 
        ? calculateDelta(metrics, latestEntry.metrics) 
        : undefined;
      
      // Step 4: Determine status
      const { status, qualityIssue } = determineStatus(metrics, delta);
      
      // Step 5: Check for escalation
      const escalation = checkEscalation(previousEntries, status);
      
      // Step 6: Generate AI summaries (with fallback to templates)
      let llmSummary = getTemplateSummary(metrics, status, delta);
      let patientInstructions = getTemplateInstructions(status);

      // Try to get AI-generated content
      try {
        const aiResponse = await generateAISummary(metrics, status, delta, patientContext);
        if (aiResponse) {
          llmSummary = aiResponse.summary;
          patientInstructions = aiResponse.instructions;
        }
      } catch (aiError) {
        console.log('Using template fallback for AI summary');
      }

      // Step 7: Create and save entry
      const entry: WoundEntry = {
        id: uuidv4(),
        patientId,
        timestamp: new Date().toISOString(),
        imagePath: '',
        imageData,
        metrics,
        status,
        llmSummary,
        patientInstructions,
        patientContext,
        deltaFromPrevious: delta,
      };

      addWoundEntry(entry);

      return {
        metrics,
        status,
        llmSummary,
        patientInstructions,
        qualityIssue,
        delta,
        escalation: escalation.required ? escalation : undefined,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeWound,
    isAnalyzing,
    error,
  };
}

async function generateAISummary(
  metrics: WoundMetrics,
  status: string,
  delta: any,
  context: PatientContext
): Promise<{ summary: string; instructions: string[] } | null> {
  // This would call your edge function
  // For now, returning null to use templates
  // When Lovable Cloud is enabled, this will call the AI edge function
  return null;
}
