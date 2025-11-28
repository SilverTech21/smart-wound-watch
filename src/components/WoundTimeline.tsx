import { useState } from 'react';
import { WoundEntry } from '@/types/wound';
import { StatusBadge } from './StatusBadge';
import { MetricsCard } from './MetricsCard';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateWoundPDF, downloadPDF } from '@/lib/pdfGenerator';

interface WoundTimelineProps {
  entries: WoundEntry[];
}

export function WoundTimeline({ entries }: WoundTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleDownloadPDF = async (entry: WoundEntry) => {
    const blob = await generateWoundPDF(entry);
    const filename = `wound-report-${new Date(entry.timestamp).toISOString().split('T')[0]}.pdf`;
    downloadPDF(blob, filename);
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-4 rounded-full bg-muted inline-block mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No entries yet</h3>
        <p className="text-muted-foreground">Upload your first wound image to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry, index) => {
        const isExpanded = expandedId === entry.id;
        const date = new Date(entry.timestamp);
        
        return (
          <div
            key={entry.id}
            className={cn(
              'card-medical overflow-hidden transition-all duration-300',
              isExpanded ? 'ring-2 ring-primary/20' : ''
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              className="w-full p-4 flex items-center gap-4 text-left hover:bg-accent/50 transition-colors"
            >
              <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={entry.imageData}
                  alt="Wound"
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={entry.status} size="sm" />
                  {entry.deltaFromPrevious && (
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      entry.deltaFromPrevious.areaPctDelta > 0 
                        ? 'bg-status-concerning-bg text-status-concerning'
                        : 'bg-status-stable-bg text-status-stable'
                    )}>
                      {entry.deltaFromPrevious.areaPctDelta > 0 ? '↑' : '↓'} 
                      {Math.abs(entry.deltaFromPrevious.areaPctDelta).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPDF(entry);
                  }}
                >
                  <FileText className="h-4 w-4" />
                </Button>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-4 animate-slide-up">
                <hr className="border-border" />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <img
                      src={entry.imageData}
                      alt="Wound"
                      className="w-full rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Clinical Summary</h4>
                    <p className="text-sm text-muted-foreground mb-4">{entry.llmSummary}</p>
                    
                    <h4 className="font-semibold text-foreground mb-2">Patient Instructions</h4>
                    <ul className="space-y-2">
                      {entry.patientInstructions.map((instruction, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="text-primary font-semibold">{i + 1}.</span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <MetricsCard metrics={entry.metrics} delta={entry.deltaFromPrevious} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
