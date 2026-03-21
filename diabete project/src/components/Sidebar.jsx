import { Home, LayoutDashboard, History, PlusSquare, Activity, User, Settings, Droplet, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: History, label: 'Logs', path: '/food-history' },
    { icon: PlusSquare, label: 'Meals', path: '/new-analysis' },
    { icon: Activity, label: 'Health Hub', path: '/insights' },
    { icon: User, label: 'Profile', path: '/profile' },
];

export default function Sidebar({ className }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <aside className={cn("py-6 px-4 flex flex-col items-center bg-white", className)}>
            <div className="mb-10 w-full flex items-center gap-3 px-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-sm">
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
                                    ? "bg-primary-50 text-primary-700 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )
                        }
                    >
                        <item.icon className={cn("h-5 w-5", "text-slate-400")} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto w-full pt-4 space-y-2">
                <NavLink
                    to="/settings"
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                >
                    <Settings className="h-5 w-5 text-slate-400" />
                    Settings
                </NavLink>
                
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-semibold text-sm bg-red-50/50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-50 hover:border-red-200 mt-2"
                >
                    <LogOut className="h-5 w-5 text-red-500" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
