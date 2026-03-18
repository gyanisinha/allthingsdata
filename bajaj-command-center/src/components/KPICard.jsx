export default function KPICard({ title, value, change, positive, icon, subtitle }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-blue-500 transition-colors duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${positive ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
          {change}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-white text-2xl font-bold mb-1">{value}</p>
      <p className="text-gray-500 text-xs">{subtitle}</p>
    </div>
  );
}
