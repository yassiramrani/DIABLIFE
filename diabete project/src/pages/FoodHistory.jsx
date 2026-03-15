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
        <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <History className="h-6 w-6 text-primary-500" />
                    Food History
                </h2>
                <p className="text-slate-500">Your recently analyzed and logged meals.</p>
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
                <div className="space-y-4">
                    {logs.map(log => (
                        <Card key={log.id} className="overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 px-4 flex flex-row items-center justify-between">
                                <CardTitle className="text-base font-semibold text-slate-800">
                                    {log.meal_summary || 'Analyzed Meal'}
                                </CardTitle>
                                <span className="text-xs text-slate-500 font-medium">
                                    {log.createdAt ? new Date(log.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown time'}
                                </span>
                            </CardHeader>
                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <div className="col-span-1 md:col-span-2">
                                    <div className="flex gap-2 flex-wrap mb-2">
                                        {log.components?.map((c, i) => (
                                            <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                                                {c.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                        {log.diasense_advice?.prediction || log.predictionText || log.advice || 'No prediction available'}
                                    </p>
                                </div>
                                <div className="text-center md:text-right flex flex-row md:flex-col justify-around md:justify-end md:gap-1">
                                    <div className="flex items-center gap-1 justify-center md:justify-end font-bold text-slate-900">
                                        <Flame className="h-4 w-4 text-orange-500" />
                                        {log.total_carbs_est || log.totalCarbs || 0}g Carbs
                                    </div>
                                    <div className={`text-xs font-semibold px-2 py-1 rounded inline-block ${getRiskColor(log.diasense_advice?.risk_level || log.riskLevel)}`}>
                                        {log.diasense_advice?.risk_level || log.riskLevel || 'Unknown'} Risk
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
