import { Home, LayoutDashboard, History, PlusSquare, Activity, User, Settings, Droplet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: History, label: 'Logs', path: '/food-history' },
    { icon: PlusSquare, label: 'Meals', path: '/new-analysis' },
    { icon: Activity, label: 'Health Hub', path: '/insights' },
    { icon: User, label: 'Profile', path: '/profile' },
];

export default function Sidebar({ className }) {
    return (
        <aside className={cn("py-6 px-4 flex flex-col items-center bg-white", className)}>
            <div className="mb-10 w-full flex items-center gap-3 px-2">
                <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                    <Droplet className="h-5 w-5 fill-white text-white mt-0.5" />
                </div>
                <span className="font-bold text-lg text-slate-800 tracking-tight uppercase">DIABLIFE</span>
                <div className="ml-auto w-8 h-4 bg-slate-200 rounded-full flex items-center px-0.5 shadow-inner">
                    <div className="h-3 w-3 bg-white rounded-full shadow-sm"></div>
                </div>
            </div>

            <nav className="flex-1 w-full space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-semibold text-sm",
                                isActive
                                    ? "bg-[#D8EEFC] text-slate-800 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )
                        }
                    >
                        <item.icon className={cn("h-5 w-5", "text-slate-400")} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto w-full pt-4">
                <NavLink
                    to="/settings"
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                >
                    <Settings className="h-5 w-5 text-slate-400" />
                    Settings
                </NavLink>
            </div>
        </aside>
    );
}
