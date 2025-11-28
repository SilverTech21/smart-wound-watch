import { useState } from 'react';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/StatusBadge';
import { WoundTimeline } from '@/components/WoundTimeline';
import { TrendCharts } from '@/components/TrendCharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllPatients, getUrgentAndConcerningEntries } from '@/lib/storage';
import { generateWoundPDF, downloadPDF } from '@/lib/pdfGenerator';
import { Patient, WoundEntry } from '@/types/wound';
import { 
  Users, 
  AlertTriangle, 
  FileText, 
  ChevronRight,
  User,
  Calendar,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Clinician = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const patients = getAllPatients();
  const alerts = getUrgentAndConcerningEntries();

  const handleDownloadAllReports = async (patient: Patient) => {
    for (const entry of patient.entries) {
      const blob = await generateWoundPDF(entry);
      const filename = `${patient.name}-report-${new Date(entry.timestamp).toISOString().split('T')[0]}.pdf`;
      downloadPDF(blob, filename);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Clinician Dashboard
          </h1>
          <p className="text-muted-foreground">
            Review patient wound histories and manage care recommendations
          </p>
        </div>

        {/* Alert Banner */}
        {alerts.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-status-urgent-bg border border-status-urgent">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-status-urgent" />
              <div>
                <p className="font-semibold text-foreground">
                  {alerts.length} wound{alerts.length > 1 ? 's' : ''} requiring attention
                </p>
                <p className="text-sm text-muted-foreground">
                  Review urgent and concerning cases below
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <div className="card-medical">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Patients</h2>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {patients.length} total
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                {patients.length === 0 ? (
                  <div className="p-8 text-center">
                    <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No patients yet</p>
                  </div>
                ) : (
                  patients.map((patient) => {
                    const latestEntry = patient.entries[patient.entries.length - 1];
                    const hasAlert = patient.entries.some(
                      e => e.status === 'Urgent' || e.status === 'Concerning'
                    );
                    
                    return (
                      <button
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient(patient);
                          setActiveTab('overview');
                        }}
                        className={cn(
                          'w-full p-4 text-left hover:bg-accent transition-colors flex items-center gap-3',
                          selectedPatient?.id === patient.id && 'bg-accent'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          hasAlert ? 'bg-status-urgent-bg' : 'bg-muted'
                        )}>
                          <User className={cn(
                            'h-5 w-5',
                            hasAlert ? 'text-status-urgent' : 'text-muted-foreground'
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {patient.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {patient.entries.length} entries
                          </p>
                        </div>
                        {latestEntry && (
                          <StatusBadge status={latestEntry.status} size="sm" showIcon={false} />
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Patient Header */}
                <div className="card-medical p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {selectedPatient.name}
                        </h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          First visit: {new Date(selectedPatient.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleDownloadAllReports(selectedPatient)}
                      disabled={selectedPatient.entries.length === 0}
                    >
                      <FileText className="h-4 w-4" />
                      Download All Reports
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard
                        label="Total Entries"
                        value={selectedPatient.entries.length.toString()}
                        icon={Activity}
                      />
                      <StatCard
                        label="Stable"
                        value={selectedPatient.entries.filter(e => e.status === 'Stable').length.toString()}
                        className="status-stable"
                      />
                      <StatCard
                        label="Concerning"
                        value={selectedPatient.entries.filter(e => e.status === 'Concerning').length.toString()}
                        className="status-concerning"
                      />
                      <StatCard
                        label="Urgent"
                        value={selectedPatient.entries.filter(e => e.status === 'Urgent').length.toString()}
                        className="status-urgent"
                      />
                    </div>

                    {/* Recent Alerts */}
                    <div className="card-medical p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-status-concerning" />
                        Recent Alerts
                      </h3>
                      <div className="space-y-3">
                        {selectedPatient.entries
                          .filter(e => e.status === 'Urgent' || e.status === 'Concerning')
                          .slice(-3)
                          .reverse()
                          .map((entry) => (
                            <AlertItem key={entry.id} entry={entry} />
                          ))}
                        {selectedPatient.entries.filter(e => 
                          e.status === 'Urgent' || e.status === 'Concerning'
                        ).length === 0 && (
                          <p className="text-muted-foreground text-sm">
                            No alerts for this patient
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-6">
                    <WoundTimeline entries={selectedPatient.entries} />
                  </TabsContent>

                  <TabsContent value="trends" className="mt-6">
                    <TrendCharts entries={selectedPatient.entries} />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="card-medical p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Select a Patient
                </h3>
                <p className="text-muted-foreground">
                  Choose a patient from the list to view their wound history
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  className 
}: { 
  label: string; 
  value: string; 
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={cn('card-medical p-4', className)}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function AlertItem({ entry }: { entry: WoundEntry }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
      <StatusBadge status={entry.status} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">
          {entry.llmSummary}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(entry.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default Clinician;
