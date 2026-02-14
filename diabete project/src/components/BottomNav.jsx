import { Home, LayoutDashboard, Utensils, Activity, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutDashboard, label: 'Dash', path: '/dashboard' },
    { icon: Utensils, label: 'Add', path: '/food-log' },
    { icon: Activity, label: 'Insights', path: '/insights' },
    { icon: User, label: 'Profile', path: '/profile' },
];

export default function BottomNav({ className }) {
    return (
        <nav className={cn("flex justify-around items-center px-2 py-3 safe-area-pb", className)}>
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        cn(
                            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[64px]",
                            isActive
                                ? "text-primary-600"
                                : "text-slate-400 hover:text-slate-600"
                        )
                    }
                >
                    <item.icon className={cn("h-6 w-6", item.label === 'Add' && "text-primary-500")} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
