import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';

export default function Layout() {
    return (
        <div className="flex h-screen bg-background text-slate-900 overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white" />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                <div className="container mx-auto p-4 md:p-8 max-w-5xl">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <BottomNav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white z-50" />
        </div>
    );
}
