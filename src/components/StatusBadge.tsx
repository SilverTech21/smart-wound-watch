import { WoundStatus } from '@/types/wound';
import { cn } from '@/lib/utils';
import { CheckCircle, Eye, AlertTriangle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: WoundStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig: Record<WoundStatus, { 
  className: string; 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = {
  Stable: {
    className: 'status-stable',
    icon: CheckCircle,
    label: 'Stable',
  },
  Monitor: {
    className: 'status-monitor',
    icon: Eye,
    label: 'Monitor',
  },
  Concerning: {
    className: 'status-concerning',
    icon: AlertTriangle,
    label: 'Concerning',
  },
  Urgent: {
    className: 'status-urgent',
    icon: AlertCircle,
    label: 'Urgent',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border',
        config.className,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className={cn(
        size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
      )} />}
      {config.label}
    </span>
  );
}
