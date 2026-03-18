import { useState } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KPIRow } from './components/KPIRow';
import { RevenueChart } from './components/RevenueChart';
import { VolumeChart } from './components/VolumeChart';
import { ProductionPanel } from './components/ProductionPanel';
import { RegionalPanel, TopProductsPanel } from './components/RegionalPanel';
import { SupplyChainPanel, FinancePanel } from './components/SupplyChainPanel';
import { AlertsPanel } from './components/AlertsPanel';

function App() {
  const [activeTab, setActiveTab] = useState('Executive');
  const [filters, setFilters] = useState({
    plant: 'All Plants',
    zone: 'All Zones',
    segment: 'All Segments',
    period: 'FY25 YTD',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#060a16] text-slate-200">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* KPI Strip */}
      <KPIRow />

      {/* Main grid */}
      <div className="px-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Revenue chart - wide */}
        <div className="lg:col-span-5">
          <RevenueChart />
        </div>

        {/* Volume chart */}
        <div className="lg:col-span-4">
          <VolumeChart />
        </div>

        {/* Alerts */}
        <div className="lg:col-span-3">
          <AlertsPanel />
        </div>

        {/* Second row */}
        <div className="lg:col-span-3">
          <RegionalPanel />
        </div>

        <div className="lg:col-span-3">
          <ProductionPanel />
        </div>

        <div className="lg:col-span-3">
          <SupplyChainPanel />
        </div>

        <div className="lg:col-span-3">
          <FinancePanel />
        </div>

        {/* Top products - full width */}
        <div className="lg:col-span-12">
          <TopProductsPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
