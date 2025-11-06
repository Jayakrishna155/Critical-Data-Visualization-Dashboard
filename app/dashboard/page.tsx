import { generateInitialDataset } from '@/lib/dataGenerator';
import { DataProvider } from '@/components/providers/DataProvider';
import PerformanceMonitor from '@/components/ui/PerformanceMonitor';
import FilterPanel from '@/components/controls/FilterPanel';
import TimeRangeSelector from '@/components/controls/TimeRangeSelector';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import ScatterPlot from '@/components/charts/ScatterPlot';
import Heatmap from '@/components/charts/Heatmap';
import DataTable from '@/components/ui/DataTable';

export const dynamic = 'force-static';

export default async function DashboardPage() {
  const initialData = await generateInitialDataset({ points: 12000 });

  return (
    <DataProvider initialData={initialData}>
      <main className="grid">
        <section className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="row">
              <strong>Controls</strong>
              <span className="muted">Real-time 100ms updates</span>
            </div>
            <PerformanceMonitor />
          </div>
          <div className="row" style={{ flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
            <FilterPanel />
            <TimeRangeSelector />
          </div>
        </section>

        <section className="card">
          <strong>Data Table</strong>
          <DataTable />
        </section>

        <section className="card">
          <strong>Line Chart</strong>
          <LineChart />
        </section>
        <section className="card">
          <strong>Bar Chart</strong>
          <BarChart />
        </section>
        <section className="card">
          <strong>Scatter Plot</strong>
          <ScatterPlot />
        </section>
        <section className="card">
          <strong>Heatmap</strong>
          <Heatmap />
        </section>
      </main>
    </DataProvider>
  );
}


