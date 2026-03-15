import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Activity, Brain, Shield, ArrowRight, ActivityIcon, Droplet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !loading) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) return null;

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-600/30 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-rose-600/20 blur-[100px] rounded-full pointer-events-none"></div>

            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-24">
                
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-medium backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        Next-Gen AI Diabetes Management
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Empower your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-rose-400">DIABLIFE</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Seamlessly log meals with AI vision, monitor glucose in real-time, and get clinical-grade insights—all in one intelligent platform designed for you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/signup">
                            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-primary-600 hover:bg-primary-500 shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] border border-primary-400/50">
                                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Glassmorphism Dashboard Preview Mock / Stats */}
                <div className="mt-24 mb-32 relative mx-auto max-w-5xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-500/20 to-transparent blur-3xl rounded-3xl -z-10"></div>
                    <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-2 md:p-4 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                        <div className="rounded-2xl bg-slate-950 border border-white/5 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                    <Brain className="h-6 w-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">AI Vision Analysis</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Snap a photo of your meal. Our AI instantly calculates carbs, identifies the glycemic index, and predicts the exact glucose impact.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                                    <ActivityIcon className="h-6 w-6 text-rose-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Live Pump Sync</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Connect your CGM and insulin pump directly. Monitor exact insulin-on-board and get critical low/high alerts immediately.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                    <Shield className="h-6 w-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Emergency Guard</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    If you enter a critical state for too long without action, DIABLIFE automatically notifies your emergency contacts or emergency services.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto pb-24">
                    <div className="space-y-6">
                        <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10">
                            <Droplet className="h-6 w-6 text-rose-400" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            Your complete health <br/> command center
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Ditch the fragmented apps. DIABLIFE brings food logging, active insulin tracking, historic charts, and custom daily carb limits into one unified, stunning interface.
                        </p>
                        <ul className="space-y-3 pt-4">
                            {[
                                "Customizable daily total targets",
                                "AI risk level warnings before you eat",
                                "Continuous Glucose Monitoring (CGM) integration",
                                "Secure session persistence"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/20 text-primary-400">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-rose-600/20 blur-3xl rounded-full"></div>
                        <div className="relative h-80 rounded-[2rem] border border-white/10 bg-slate-900/80 backdrop-blur-md p-8 shadow-2xl flex flex-col items-center justify-center gap-4">
                            <div className="flex items-center gap-4 text-4xl font-bold text-white">
                                98 <span className="text-lg text-slate-400 font-medium tracking-normal">mg/dL</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-2 w-16 bg-green-500 rounded-full"></div>
                                <div className="h-2 w-16 bg-green-500 rounded-full"></div>
                                <div className="h-2 w-16 bg-slate-800 rounded-full"></div>
                            </div>
                            <p className="text-center text-slate-400 text-sm mt-4">Perfectly in range.<br/>100% time in range today.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
