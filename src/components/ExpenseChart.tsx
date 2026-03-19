import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreVertical } from 'lucide-react';

const data = [
  { name: 'Housing', value: 45, color: '#34d399' },
  { name: 'Food', value: 25, color: '#60e2b1' },
  { name: 'Transport', value: 15, color: '#1f8f72' },
  { name: 'Leisure', value: 15, color: '#f38b82' },
];

export function ExpenseChart() {
  return (
    <div className="bg-emerald-zenith-surface rounded-2xl p-4.5 md:p-5 border border-emerald-900/10 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4.5">
        <h4 className="text-lg md:text-xl font-bold">Expenses by Category</h4>
        <button className="text-emerald-zenith-text-muted hover:text-emerald-zenith-text transition-colors">
          <MoreVertical className="w-4.5 h-4.5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full aspect-square max-w-48 md:max-w-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#133026', border: '1px solid rgba(158, 183, 174, 0.2)', borderRadius: '12px', color: '#f2faf6' }}
                itemStyle={{ color: '#f6f8f7' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-zenith-text-muted">Total</span>
            <span className="text-xl md:text-2xl font-black">$6.4k</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-2.5 mt-5 w-full">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs md:text-sm font-medium text-emerald-zenith-text-muted whitespace-nowrap">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
