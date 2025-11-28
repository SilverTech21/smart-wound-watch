import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Heart, Upload, Clock, Stethoscope } from 'lucide-react';

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Heart },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/timeline', label: 'Timeline', icon: Clock },
    { path: '/clinician', label: 'Clinician', icon: Stethoscope },
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg gradient-hero">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              WoundCare
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile nav */}
          <nav className="flex md:hidden items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'p-2 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
