import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { disbursementData } from "../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white text-sm font-semibold">₹{payload[0].value} Cr</p>
      </div>
    );
  }
  return null;
};

export default function DisbursementChart() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-white font-semibold text-lg">Product-wise Loan Disbursements</h2>
        <p className="text-gray-400 text-sm">Current Quarter • Amount in ₹ Crores</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={disbursementData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="product" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={{ stroke: "#374151" }} tickLine={false} angle={-20} textAnchor="end" />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
          <Bar dataKey="amount" name="Disbursement" radius={[6, 6, 0, 0]}>
            {disbursementData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
