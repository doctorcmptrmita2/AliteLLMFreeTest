interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  icon: string
  gradient: string
}

export default function StatsCard({ title, value, change, icon, gradient }: StatsCardProps) {
  return (
    <div className="glass rounded-2xl p-6 hover:border-purple-500/50 transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}


