import { Zap, Moon, Pill, Activity, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';

const factors = [
    { icon: Zap, label: "Stress", value: "High", status: "warning", color: "text-orange-500", bg: "bg-orange-50" },
    { icon: Moon, label: "Sleep", value: "6h 30m", status: "warning", color: "text-indigo-500", bg: "bg-indigo-50" },
    { icon: Activity, label: "Activity", value: "Active", status: "success", color: "text-green-500", bg: "bg-green-50" },
    { icon: Pill, label: "Meds", value: "On Track", status: "success", color: "text-blue-500", bg: "bg-blue-50" },
];

export default function MetabolicFactors() {
    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                    <span>Metabolic Factors</span>
                    <AlertCircle className="h-4 w-4 text-slate-400" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {factors.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${factor.bg} ${factor.color}`}>
                                    <factor.icon className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">{factor.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-900">{factor.value}</span>
                                <div className={`h-2 w-2 rounded-full ${factor.status === 'success' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
