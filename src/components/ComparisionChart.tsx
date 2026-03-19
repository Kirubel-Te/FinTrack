import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'JAN', income: 4000, expenses: 2400 },
  { month: 'FEB', income: 5000, expenses: 3200 },
  { month: 'MAR', income: 3500, expenses: 2800 },
  { month: 'APR', income: 6000, expenses: 2000 },
  { month: 'MAY', income: 5500, expenses: 3500 },
  { month: 'JUN', income: 5800, expenses: 2600 },
];

export function ComparisonChart() {
  return (
    <div className="bg-emerald-zenith-surface rounded-2xl p-4.5 md:p-5 border border-emerald-900/10 h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h4 className="text-lg md:text-xl font-bold">Income vs Expenses</h4>
          <p className="text-xs md:text-sm text-emerald-zenith-text-muted">Comparison over the last 6 months</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-zenith-primary" />
            <span className="text-[11px] font-bold text-emerald-zenith-text-muted uppercase tracking-wider">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-zenith-error/60" />
            <span className="text-[11px] font-bold text-emerald-zenith-text-muted uppercase tracking-wider">Expenses</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-48 md:min-h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#c0c8c3', fontSize: 11, fontWeight: 700 }}
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#133026', border: '1px solid rgba(158, 183, 174, 0.2)', borderRadius: '12px', color: '#f2faf6' }}
            />
            <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar dataKey="expenses" fill="rgba(243, 139, 130, 0.7)" radius={[4, 4, 0, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
