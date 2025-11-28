import { WoundEntry } from '@/types/wound';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrendChartsProps {
  entries: WoundEntry[];
}

export function TrendCharts({ entries }: TrendChartsProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const chartData = sortedEntries.map((entry, index) => ({
    name: new Date(entry.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    index: index + 1,
    redness: entry.metrics.redness,
    area: entry.metrics.areaPct,
    exudate: entry.metrics.exudateRatio * 100,
    status: entry.status,
  }));

  if (entries.length < 2) {
    return (
      <div className="card-medical p-8 text-center">
        <p className="text-muted-foreground">
          Upload at least 2 images to see trend charts.
        </p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    Stable: 'hsl(142, 76%, 36%)',
    Monitor: 'hsl(210, 100%, 50%)',
    Concerning: 'hsl(25, 95%, 53%)',
    Urgent: 'hsl(0, 84%, 60%)',
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const status = payload[0]?.payload?.status;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
              {entry.name === 'Exudate' || entry.name === 'Area' ? '%' : ''}
            </p>
          ))}
          {status && (
            <p className="text-sm mt-2" style={{ color: statusColors[status] }}>
              Status: {status}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="card-medical p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Redness Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="redness"
              name="Redness"
              stroke="hsl(var(--status-concerning))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--status-concerning))', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card-medical p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Wound Area Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="area"
              name="Area"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card-medical p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Exudate Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="exudate"
              name="Exudate"
              stroke="hsl(var(--status-monitor))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--status-monitor))', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
