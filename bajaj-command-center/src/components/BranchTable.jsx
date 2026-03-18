import { branchData } from "../data/mockData";

export default function BranchTable() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-white font-semibold text-lg">Top Branch Performance</h2>
        <p className="text-gray-400 text-sm">Top 10 branches by revenue • FY 2024-25</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              {["#", "Branch", "City", "State", "Revenue (Cr)", "Loans (Cr)", "Customers", "NPA %", "Growth %"].map((h) => (
                <th key={h} className="text-left text-gray-400 font-medium pb-3 pr-4 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {branchData.map((row, idx) => (
              <tr key={row.rank} className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${idx === 0 ? "bg-blue-900/10" : ""}`}>
                <td className="py-3 pr-4 text-gray-400 font-medium">{row.rank}</td>
                <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">{row.branch}</td>
                <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{row.city}</td>
                <td className="py-3 pr-4 text-gray-400 whitespace-nowrap">{row.state}</td>
                <td className="py-3 pr-4 text-white font-semibold">₹{row.revenue.toLocaleString("en-IN")}</td>
                <td className="py-3 pr-4 text-indigo-400">₹{row.loans.toLocaleString("en-IN")}</td>
                <td className="py-3 pr-4 text-gray-300">{row.customers.toLocaleString("en-IN")}</td>
                <td className="py-3 pr-4">
                  <span className={`font-semibold ${row.npa < 1 ? "text-green-400" : "text-yellow-400"}`}>{row.npa}%</span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-green-400 font-semibold">+{row.growth}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
