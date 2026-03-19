import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp?: boolean;
  icon: LucideIcon;
  variant?: 'primary' | 'surface';
}

export function StatCard({ label, value, trend, trendUp, icon: Icon, variant = 'surface' }: StatCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <div className={cn(
      "relative overflow-hidden p-4.5 md:p-5 rounded-2xl transition-all duration-300 group",
      isPrimary 
        ? "bg-emerald-zenith-primary text-emerald-zenith-accent shadow-xl shadow-emerald-500/15" 
        : "bg-emerald-zenith-surface border border-emerald-900/20 hover:border-emerald-zenith-primary/30"
    )}>
      {isPrimary && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
      )}
      
      <div className="relative z-10 flex justify-between items-start mb-3.5">
        <span className={cn(
          "text-[11px] font-bold uppercase tracking-[0.12em]",
          isPrimary ? "text-emerald-zenith-accent/60" : "text-emerald-zenith-text-muted"
        )}>
          {label}
        </span>
        <div className={cn(
          "p-1.5 rounded-lg",
          isPrimary ? "bg-emerald-zenith-accent/10" : "bg-emerald-zenith-surface-high"
        )}>
          <Icon className={cn("w-4 h-4", isPrimary ? "text-emerald-zenith-accent" : "text-emerald-zenith-primary")} />
        </div>
      </div>

      <div className="relative z-10">
        <h3 className={cn(
          "text-2xl md:text-[30px] font-black tracking-tight mb-1.5",
          isPrimary ? "text-emerald-zenith-accent" : "text-emerald-zenith-text"
        )}>
          {value}
        </h3>
        <div className={cn(
          "flex items-center gap-1.5 text-xs md:text-[13px] font-bold w-fit px-2 py-1 rounded-full",
          isPrimary 
            ? "bg-emerald-zenith-accent/10 text-emerald-zenith-accent" 
            : trendUp 
              ? "bg-emerald-zenith-primary/10 text-emerald-zenith-primary" 
              : "bg-emerald-zenith-error/10 text-emerald-zenith-error"
        )}>
          {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{trend}</span>
        </div>
      </div>
    </div>
  );
}
