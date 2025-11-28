import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useWoundAnalysis } from '@/hooks/useWoundAnalysis';
import { PatientContext } from '@/types/wound';
import { Loader2, Scan, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const comorbidityOptions = [
  'Diabetes',
  'Hypertension',
  'Heart Disease',
  'Kidney Disease',
  'Immunocompromised',
  'Peripheral Vascular Disease',
];

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { analyzeWound, isAnalyzing, error } = useWoundAnalysis();
  
  const [imageData, setImageData] = useState<string | null>(null);
  const [age, setAge] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [selectedComorbidities, setSelectedComorbidities] = useState<string[]>([]);

  const handleComorbidityToggle = (comorbidity: string) => {
    setSelectedComorbidities(prev =>
      prev.includes(comorbidity)
        ? prev.filter(c => c !== comorbidity)
        : [...prev, comorbidity]
    );
  };

  const handleAnalyze = async () => {
    if (!imageData) {
      toast({
        title: 'Image Required',
        description: 'Please upload a wound image first.',
        variant: 'destructive',
      });
      return;
    }

    if (!age || parseInt(age) < 1 || parseInt(age) > 120) {
      toast({
        title: 'Valid Age Required',
        description: 'Please enter a valid age between 1 and 120.',
        variant: 'destructive',
      });
      return;
    }

    const patientContext: PatientContext = {
      age: parseInt(age),
      notes,
      comorbidities: selectedComorbidities,
    };

    const result = await analyzeWound(imageData, patientContext);
    
    if (result) {
      navigate('/result', { 
        state: { 
          result,
          imageData,
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Upload Wound Image
            </h1>
            <p className="text-muted-foreground">
              Take a clear photo of your wound for AI-powered analysis
            </p>
          </div>

          <div className="space-y-6">
            {/* Image Upload */}
            <div className="card-medical p-6">
              <Label className="text-lg font-semibold mb-4 block">
                Wound Image
              </Label>
              <ImageUploader 
                onImageSelect={setImageData}
                currentImage={imageData || undefined}
              />
            </div>

            {/* Patient Information */}
            <div className="card-medical p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">
                Patient Information
              </h2>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={1}
                  max={120}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="mb-3 block">Relevant Conditions</Label>
                <div className="grid grid-cols-2 gap-3">
                  {comorbidityOptions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={selectedComorbidities.includes(condition)}
                        onCheckedChange={() => handleComorbidityToggle(condition)}
                      />
                      <label
                        htmlFor={condition}
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe any symptoms: pain level, odor, dressing changes, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !imageData}
              variant="hero"
              size="xl"
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Wound...
                </>
              ) : (
                <>
                  <Scan className="h-5 w-5" />
                  Analyze Wound
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
