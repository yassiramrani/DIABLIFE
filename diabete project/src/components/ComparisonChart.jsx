import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const data = [
    { time: '0', you: 100, personA: 100 },
    { time: '15', you: 120, personA: 110 },
    { time: '30', you: 160, personA: 125 },
    { time: '45', you: 210, personA: 135 },
    { time: '60', you: 190, personA: 130 },
    { time: '75', you: 160, personA: 120 },
    { time: '90', you: 130, personA: 110 },
    { time: '120', you: 110, personA: 105 },
];

export default function ComparisonChart() {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Response Visualization: You vs. Standard</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorYou" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPersonA" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" hide />
                            <YAxis hide />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5} />
                            <Tooltip labelFormatter={(label) => `${label} min`} />
                            <Area type="monotone" dataKey="you" stroke="#EF4444" fillOpacity={1} fill="url(#colorYou)" name="You (High Spike)" />
                            <Area type="monotone" dataKey="personA" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPersonA)" name="Standard Response" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-sm font-medium text-slate-600">Your Response (Spike)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-slate-600">Standard Response</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
