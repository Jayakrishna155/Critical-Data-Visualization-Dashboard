export type ChartType = 'line' | 'bar' | 'scatter' | 'heatmap';

export interface DataPoint {
  timestamp: number;
  value: number;
  category: string;
  metadata?: Record<string, unknown>;
}

export interface ChartConfig {
  type: ChartType;
  dataKey: string;
  color: string;
  visible: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number | null;
  renderTime: number;
  dataProcessingTime: number;
}

export type TimeAggregation = '1m' | '5m' | '1h' | 'raw';

export interface DashboardState {
  data: DataPoint[];
  categories: string[];
  selectedCategories: Set<string>;
  timeRangeMs: number; // window size
  aggregation: TimeAggregation;
  updateIntervalMs: number; // stream interval
}


