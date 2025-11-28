import { AlertCircle, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface EscalationAlertProps {
  reason: string;
  onDismiss?: () => void;
}

export function EscalationAlert({ reason, onDismiss }: EscalationAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl shadow-xl max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="bg-status-urgent p-4 flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/20 rounded-full">
            <AlertCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-primary-foreground">Clinical Attention Required</h2>
        </div>
        
        <div className="p-6">
          <p className="text-foreground mb-4">{reason}</p>
          
          <div className="bg-status-urgent-bg rounded-lg p-4 mb-6">
            <p className="text-sm text-foreground">
              <strong>Recommended Action:</strong> Please contact your healthcare provider 
              immediately or visit the nearest urgent care facility.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="urgent" className="flex-1" size="lg">
              <Phone className="h-4 w-4" />
              Call Healthcare Provider
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleDismiss}
              className="flex-1"
            >
              <X className="h-4 w-4" />
              Acknowledge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
