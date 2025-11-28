import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/StatusBadge';
import { MetricsCard } from '@/components/MetricsCard';
import { EscalationAlert } from '@/components/EscalationAlert';
import { Button } from '@/components/ui/button';
import { AnalysisResult } from '@/types/wound';
import { FileText, Plus, Clock, AlertTriangle } from 'lucide-react';
import { generateWoundPDF, downloadPDF } from '@/lib/pdfGenerator';
import { getLatestEntry, getCurrentPatientId } from '@/lib/storage';
import { useEffect, useState } from 'react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showEscalation, setShowEscalation] = useState(false);
  
  const result = location.state?.result as AnalysisResult | undefined;
  const imageData = location.state?.imageData as string | undefined;

  useEffect(() => {
    if (!result) {
      navigate('/upload');
    } else if (result.escalation?.required) {
      setShowEscalation(true);
    }
  }, [result, navigate]);

  if (!result || !imageData) {
    return null;
  }

  const handleDownloadPDF = async () => {
    const patientId = getCurrentPatientId();
    const entry = getLatestEntry(patientId);
    if (entry) {
      const blob = await generateWoundPDF(entry);
      const filename = `wound-report-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(blob, filename);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {showEscalation && result.escalation && (
        <EscalationAlert 
          reason={result.escalation.reason}
          onDismiss={() => setShowEscalation(false)}
        />
      )}
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Status */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Analysis Complete
            </h1>
            <StatusBadge status={result.status} size="lg" />
          </div>

          {/* Quality Warning */}
          {result.qualityIssue && (
            <div className="mb-6 p-4 rounded-lg bg-status-concerning-bg border border-status-concerning flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-status-concerning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Image Quality Issue</p>
                <p className="text-sm text-muted-foreground">{result.qualityIssue}</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Wound Image */}
            <div className="card-medical overflow-hidden">
              <img
                src={imageData}
                alt="Analyzed wound"
                className="w-full h-auto"
              />
            </div>

            {/* Summary & Instructions */}
            <div className="space-y-6">
              <div className="card-medical p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Clinical Summary
                </h2>
                <p className="text-muted-foreground">
                  {result.llmSummary}
                </p>
              </div>

              <div className="card-medical p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Care Instructions
                </h2>
                <ol className="space-y-3">
                  {result.patientInstructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Analysis Metrics
            </h2>
            <MetricsCard metrics={result.metrics} delta={result.delta} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleDownloadPDF} variant="default" size="lg">
              <FileText className="h-4 w-4" />
              Generate PDF Report
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/upload">
                <Plus className="h-4 w-4" />
                Add Another Photo
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/timeline">
                <Clock className="h-4 w-4" />
                View Timeline
              </Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This analysis is for informational purposes only 
            and does not constitute medical advice. Always consult a healthcare professional 
            for proper diagnosis and treatment.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Result;
