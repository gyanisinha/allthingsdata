export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">B</div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-wide">Bajaj Command Center</h1>
            <p className="text-gray-400 text-xs">Business Intelligence Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-gray-400 text-xs">Last Updated</p>
            <p className="text-white text-sm font-medium">
              {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-900 border border-green-700 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
