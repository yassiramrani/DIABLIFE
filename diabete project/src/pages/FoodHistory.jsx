import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFoodLogs } from '../lib/foodLogService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { History, Calendar, Flame } from 'lucide-react';

export default function FoodHistory() {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            if (user) {
                const fetchedLogs = await getFoodLogs(user.uid, 7); // fetch last 7 days
                setLogs(fetchedLogs);
            }
            setIsLoading(false);
        };
        fetchLogs();
    }, [user]);

    const getRiskColor = (level) => {
        const l = level?.toLowerCase() || '';
        if (l.includes('high')) return 'text-red-700 bg-red-50 border-red-200';
        if (l.includes('medium') || l.includes('moderate')) return 'text-orange-700 bg-orange-50 border-orange-200';
        return 'text-green-700 bg-green-50 border-green-200';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6 ml-2">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight">
                        <div className="p-2 bg-primary-100 rounded-xl">
                            <History className="h-7 w-7 text-primary-600" />
                        </div>
                        Food History
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Review your recently analyzed and logged meals.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12 text-slate-500">Loading history...</div>
            ) : logs.length === 0 ? (
                <Card className="bg-slate-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                        <Calendar className="h-12 w-12 text-slate-300 mb-4" />
                        <p>No meals logged yet.</p>
                        <p className="text-sm">Head over to New Analysis to scan your first meal.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {logs.map(log => {
                        const risk = log.diasense_advice?.risk_level || log.riskLevel || 'Unknown';
                        const isHigh = risk.toLowerCase().includes('high');
                        const isMed = risk.toLowerCase().includes('medium') || risk.toLowerCase().includes('moderate');
                        const borderColor = isHigh ? 'border-l-red-500' : isMed ? 'border-l-orange-500' : 'border-l-primary-500';
                        
                        return (
                        <div key={log.id} className={`bg-white rounded-[2rem] overflow-hidden border border-slate-200 border-l-8 ${borderColor} shadow-sm transition-shadow hover:shadow-md duration-300`}>
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-xl font-bold text-slate-800 leading-tight">
                                                {log.meal_summary || 'Analyzed Meal'}
                                            </h3>
                                            <span className="px-3 py-1 rounded-full bg-slate-100/80 text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {log.createdAt ? new Date(log.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 flex-wrap pt-1">
                                            {log.components?.slice(0, 5).map((c, i) => (
                                                <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-primary-50/50 text-primary-700 border border-primary-100/30">
                                                    {c.name}
                                                </span>
                                            ))}
                                            {(log.components?.length > 5) && (
                                                <span className="text-[11px] font-medium text-slate-400">+{log.components.length - 5} more</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="shrink-0 flex md:flex-col items-center gap-3">
                                        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-sm border border-slate-100 text-center min-w-[100px]">
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Total Carbs</div>
                                            <div className="text-xl font-black text-slate-900">{log.total_carbs_est || log.totalCarbs || 0}<span className="text-sm font-bold ml-0.5">g</span></div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-2xl border text-center font-bold text-xs capitalize ${getRiskColor(risk)}`}>
                                            {risk} Risk
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 relative">
                                    <p className="text-sm text-slate-600 leading-relaxed italic font-medium">
                                        "{log.diasense_advice?.prediction || log.predictionText || log.advice || 'Nutritional analysis completed.'}"
                                    </p>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
