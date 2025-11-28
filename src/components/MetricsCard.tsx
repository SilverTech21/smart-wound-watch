import { WoundMetrics, DeltaMetrics } from '@/types/wound';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Droplets, Activity, Sun, Focus } from 'lucide-react';

interface MetricsCardProps {
  metrics: WoundMetrics;
  delta?: DeltaMetrics;
}

function DeltaIndicator({ value, suffix = '%' }: { value: number; suffix?: string }) {
  if (Math.abs(value) < 0.1) {
    return (
      <span className="inline-flex items-center text-muted-foreground text-xs">
        <Minus className="h-3 w-3 mr-0.5" />
        No change
      </span>
    );
  }

  const isPositive = value > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? 'text-status-concerning' : 'text-status-stable';

  return (
    <span className={cn('inline-flex items-center text-xs font-medium', colorClass)}>
      <Icon className="h-3 w-3 mr-0.5" />
      {isPositive ? '+' : ''}{value.toFixed(1)}{suffix}
    </span>
  );
}

export function MetricsCard({ metrics, delta }: MetricsCardProps) {
  const metricItems = [
    {
      label: 'Redness Score',
      value: metrics.redness.toFixed(1),
      icon: Activity,
      delta: delta?.rednessDelta,
      description: 'Intensity of red coloration',
    },
    {
      label: 'Wound Area',
      value: `${metrics.areaPct.toFixed(2)}%`,
      icon: Focus,
      delta: delta?.areaPctDelta,
      description: 'Percentage of image',
    },
    {
      label: 'Exudate Ratio',
      value: `${(metrics.exudateRatio * 100).toFixed(2)}%`,
      icon: Droplets,
      delta: delta?.exudateDelta,
      description: 'Fluid discharge indicator',
    },
    {
      label: 'Brightness',
      value: metrics.brightness.toFixed(1),
      icon: Sun,
      description: 'Image lighting quality',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metricItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="card-medical p-4 animate-fade-in"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-accent">
                <Icon className="h-4 w-4 text-accent-foreground" />
              </div>
              {item.delta !== undefined && (
                <DeltaIndicator value={item.delta} />
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}
