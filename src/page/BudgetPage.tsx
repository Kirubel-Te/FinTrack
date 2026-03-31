import React from 'react';
import { 
  Home, 
  Utensils, 
  ShoppingBag, 
  Car, 
  PlusCircle, 
  ArrowRight,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Reveal } from '../components/Reveal';

interface BudgetCardProps {
  title: string;
  icon: React.ElementType;
  status: 'within_budget' | 'warning' | 'overspent';
  spent: number;
  total: number;
  large?: boolean;
}

function BudgetCard({ title, icon: Icon, status, spent, total, large }: BudgetCardProps) {
  const percentage = Math.min((spent / total) * 100, 100);
  const remaining = total - spent;
  
  const statusColors = {
    within_budget: "text-emerald-zenith-primary bg-emerald-zenith-primary/10 border-emerald-zenith-primary/20",
    warning: "text-emerald-zenith-warning bg-emerald-zenith-warning/10 border-emerald-zenith-warning/20",
    overspent: "text-emerald-zenith-error bg-emerald-zenith-error/10 border-emerald-zenith-error/20"
  };

  const barColors = {
    within_budget: "bg-emerald-zenith-primary",
    warning: "bg-emerald-zenith-warning",
    overspent: "bg-emerald-zenith-error"
  };

  return (
    <div className={cn(
      "bg-emerald-zenith-surface rounded-2xl p-5 border border-emerald-zenith-text-muted/15 hover:shadow-xl hover:shadow-emerald-zenith-primary/10 transition-all group flex flex-col",
      large ? "md:col-span-2 lg:col-span-2" : "col-span-1"
    )}>
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isStatus(status, 'within_budget') ? "bg-emerald-zenith-primary/20 text-emerald-zenith-primary" :
            isStatus(status, 'warning') ? "bg-emerald-zenith-warning/20 text-emerald-zenith-warning" :
            "bg-emerald-zenith-error/20 text-emerald-zenith-error"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-zenith-text">{title}</h3>
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 border",
              statusColors[status]
            )}>
              {status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-emerald-zenith-text-muted hover:text-emerald-zenith-text transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-emerald-zenith-text-muted hover:text-emerald-zenith-error transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {large ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <p className="text-[10px] font-black text-emerald-zenith-text-muted uppercase tracking-widest mb-2">Budget Amount</p>
            <p className="text-xl font-black text-emerald-zenith-text">${total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-zenith-text-muted uppercase tracking-widest mb-2">Spent Amount</p>
            <p className={cn("text-xl font-black", spent > total ? "text-emerald-zenith-error" : "text-emerald-zenith-primary")}>
              ${spent.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-zenith-text-muted uppercase tracking-widest mb-2">Remaining</p>
            <p className="text-xl font-black text-emerald-zenith-text">
              ${Math.max(0, remaining).toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 mb-5 flex-1">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-emerald-zenith-text-muted uppercase tracking-wider">Spent</span>
            <span className={cn("text-base font-black", spent > total ? "text-emerald-zenith-error" : "text-emerald-zenith-text")}>
              ${spent.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-emerald-zenith-text-muted uppercase tracking-wider">Total Budget</span>
            <span className="text-sm font-bold text-emerald-zenith-text-muted/60">${total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div>
        <div className="w-full bg-emerald-zenith-surface-high rounded-full h-2 mb-2 overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", barColors[status])} 
            style={{ width: `${percentage}%` }} 
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-emerald-zenith-text-muted">
            {large ? `${Math.round(percentage)}% of monthly budget utilized` : 
             status === 'overspent' ? `Exceeded by $${Math.abs(remaining)}` : 'Under Control'}
          </span>
          <span className={cn(
            status === 'overspent' ? "text-emerald-zenith-error" : 
            status === 'warning' ? "text-emerald-zenith-warning" : "text-emerald-zenith-primary"
          )}>
            {remaining > 0 ? `$${remaining} Left` : '0% Remaining'}
          </span>
        </div>
      </div>
    </div>
  );
}

function isStatus(current: string, target: string) {
  return current === target;
}

export function BudgetsPage() {
  return (
    <div className="p-5 lg:p-6 space-y-10 lg:space-y-12 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tight text-emerald-zenith-text">
            Budgets
          </h2>
          <p className="text-emerald-zenith-text-muted text-sm md:text-base font-medium max-w-lg">
            Manage your financial flow with editorial precision. Monitor limits and optimize your wealth.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-zenith-primary/10 hover:bg-emerald-zenith-primary/20 text-emerald-zenith-primary border border-emerald-zenith-primary/30 px-8 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] group">
          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Create budget</span>
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Reveal className="md:col-span-2 lg:col-span-2" delay={0.03}>
          <BudgetCard 
            title="Housing & Living"
            icon={Home}
            status="within_budget"
            spent={1850.40}
            total={3200.00}
            large
          />
        </Reveal>
        <Reveal delay={0.1}>
          <BudgetCard 
            title="Dining & Drinks"
            icon={Utensils}
            status="warning"
            spent={740.00}
            total={850.00}
          />
        </Reveal>
        <Reveal delay={0.15}>
          <BudgetCard 
            title="Personal Luxury"
            icon={ShoppingBag}
            status="overspent"
            spent={1250.00}
            total={1000.00}
          />
        </Reveal>
        <Reveal delay={0.2}>
          <BudgetCard 
            title="Transportation"
            icon={Car}
            status="within_budget"
            spent={240.00}
            total={600.00}
          />
        </Reveal>
        
        {/* New Category Card */}
        <Reveal delay={0.24}>
          <div className="bg-black/25 border-2 border-dashed border-emerald-zenith-text-muted/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-black/35 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-zenith-surface-high flex items-center justify-center text-emerald-zenith-text-muted group-hover:text-emerald-zenith-primary group-hover:scale-110 transition-all duration-300 mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-emerald-zenith-text">New Category</h4>
            <p className="text-xs font-medium text-emerald-zenith-text-muted mt-1">Plan for your next major milestone</p>
          </div>
        </Reveal>
      </div>

      {/* Analysis Section */}
      <section className="mt-12 md:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <Reveal className="lg:col-span-1 space-y-6" delay={0.05}>
            <h4 className="text-2xl md:text-3xl font-black text-emerald-zenith-text tracking-tight">
              Monthly Allocation Analysis
            </h4>
            <p className="text-emerald-zenith-text-muted leading-relaxed text-base md:text-lg">
              Your current spending velocity suggests a potential 12% surplus by month-end if trends in 
              <span className="text-emerald-zenith-primary font-bold mx-1">Transportation</span> 
              persist. Consider reallocating $200 to 
              <span className="text-emerald-zenith-warning font-bold mx-1">Investments</span>.
            </p>
            <button className="text-emerald-zenith-primary font-bold flex items-center gap-2 group text-lg">
              <span>View detailed forecast</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </Reveal>
          
          <Reveal className="lg:col-span-2" delay={0.12}>
            <div className="bg-emerald-zenith-surface-high rounded-3xl md:rounded-[2.5rem] p-1 relative overflow-hidden h-72 md:h-90 group">
            <img 
              className="w-full h-full object-cover rounded-[1.35rem] md:rounded-[2.4rem] opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700" 
              src="https://picsum.photos/seed/architecture/1200/600"
              alt="Analysis"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-emerald-zenith-surface-high via-transparent to-transparent" />
            
            <div className="absolute bottom-5 md:bottom-10 left-5 md:left-10 right-5 md:right-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
              <div>
                <p className="text-3xl md:text-[3rem] font-black text-emerald-zenith-text leading-none mb-2">$12,450.00</p>
                <p className="text-xs font-black text-emerald-zenith-primary uppercase tracking-[0.3em]">Total Monthly Capacity</p>
              </div>
              <div className="flex gap-2 items-end">
                <div className="w-3 h-16 bg-emerald-zenith-primary rounded-full" />
                <div className="w-3 h-24 bg-emerald-zenith-primary/60 rounded-full" />
                <div className="w-3 h-12 bg-emerald-zenith-primary rounded-full" />
                <div className="w-3 h-32 bg-emerald-zenith-primary/40 rounded-full" />
                <div className="w-3 h-20 bg-emerald-zenith-primary/80 rounded-full" />
              </div>
            </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
