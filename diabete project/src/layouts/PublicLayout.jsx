import { Outlet, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-slate-800">GlucoSmart</span>
                    </Link>

                    <nav className="flex items-center gap-4">
                        {user ? (
                            <Link to="/dashboard">
                                <Button>Go to Dashboard</Button>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button>Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t border-slate-200 bg-slate-50 py-8">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center text-slate-500">
                    <p>&copy; {new Date().getFullYear()} GlucoSmart. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
