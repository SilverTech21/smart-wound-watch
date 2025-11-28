import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Upload, Clock, Stethoscope, Shield, Activity, Heart, ChevronRight } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Activity,
      title: 'AI-Powered Analysis',
      description: 'Advanced image processing to detect wound characteristics and track healing progress.',
    },
    {
      icon: Clock,
      title: 'Timeline Tracking',
      description: 'Monitor your wound healing journey with visual timelines and trend charts.',
    },
    {
      icon: Shield,
      title: 'Smart Escalation',
      description: 'Automatic alerts when wounds require clinical attention.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6 animate-fade-in">
              <Heart className="h-4 w-4" />
              Intelligent Wound Monitoring
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up">
              Smart Wound-Care
              <span className="block gradient-hero bg-clip-text text-transparent">
                Concierge
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Track your wound healing progress with AI-powered analysis. 
              Get personalized care instructions and know when to seek medical attention.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button asChild variant="hero" size="xl">
                <Link to="/upload">
                  <Upload className="h-5 w-5" />
                  Upload Wound Image
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/timeline">
                  <Clock className="h-5 w-5" />
                  View Timeline
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comprehensive Wound Management
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our intelligent system helps you monitor and manage wound healing with precision.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card-medical p-6 text-center hover:-translate-y-2 transition-transform duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex p-4 rounded-2xl gradient-hero mb-4">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="card-medical p-8 md:p-12 max-w-4xl mx-auto text-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-hero opacity-5" />
            <div className="relative">
              <Stethoscope className="h-12 w-12 mx-auto mb-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Healthcare Provider?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Access the clinician dashboard to review patient wound histories, 
                track healing progress, and manage care recommendations.
              </p>
              <Button asChild variant="default" size="lg">
                <Link to="/clinician">
                  Access Clinician Dashboard
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg gradient-hero">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">WoundCare Concierge</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              This tool is for informational purposes only. Always consult a healthcare professional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
