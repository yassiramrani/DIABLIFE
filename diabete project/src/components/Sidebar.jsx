import { Home, LayoutDashboard, Utensils, Activity, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Utensils, label: 'Food Log', path: '/food-log' },
    { icon: Activity, label: 'Insights', path: '/insights' },
    { icon: User, label: 'Profile', path: '/profile' },
];

export default function Sidebar({ className }) {
    return (
        <aside className={cn("p-4", className)}>
            <div className="mb-8 flex items-center gap-2 px-2">
                <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-800">GlucoSmart</span>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium",
                                isActive
                                    ? "bg-primary-50 text-primary-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto border-t border-slate-200 pt-4">
                <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">My Device</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Connected: CGM
                    </div>
                </div>
            </div>
        </aside>
    );
}
