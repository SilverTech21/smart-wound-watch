import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { WoundTimeline } from '@/components/WoundTimeline';
import { TrendCharts } from '@/components/TrendCharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentPatientId, getPatientEntries } from '@/lib/storage';
import { Plus, List, BarChart3 } from 'lucide-react';

const Timeline = () => {
  const patientId = getCurrentPatientId();
  const entries = getPatientEntries(patientId);
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Wound Timeline
              </h1>
              <p className="text-muted-foreground">
                Track your healing progress over time
              </p>
            </div>
            <Button asChild variant="hero">
              <Link to="/upload">
                <Plus className="h-4 w-4" />
                New Upload
              </Link>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-xs">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="animate-fade-in">
              <WoundTimeline entries={entries} />
            </TabsContent>

            <TabsContent value="charts" className="animate-fade-in">
              <TrendCharts entries={entries} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Floating Upload Button - Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button asChild variant="hero" size="icon" className="h-14 w-14 rounded-full shadow-xl">
          <Link to="/upload">
            <Plus className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Timeline;
