import Header from "./components/Header";
import KPICard from "./components/KPICard";
import RevenueChart from "./components/RevenueChart";
import DisbursementChart from "./components/DisbursementChart";
import BranchTable from "./components/BranchTable";
import { kpiData } from "./data/mockData";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiData.map((kpi) => (
            <KPICard key={kpi.title} {...kpi} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <DisbursementChart />
        </div>

        {/* Branch Table */}
        <BranchTable />
      </main>
    </div>
  );
}
