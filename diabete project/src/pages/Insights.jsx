import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ComparisonChart from '../components/ComparisonChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const data = [
    { day: 'Mon', spikes: 2, avg: 120 },
    { day: 'Tue', spikes: 1, avg: 115 },
    { day: 'Wed', spikes: 4, avg: 145 },
    { day: 'Thu', spikes: 1, avg: 118 },
    { day: 'Fri', spikes: 0, avg: 110 },
    { day: 'Sat', spikes: 2, avg: 125 },
    { day: 'Sun', spikes: 1, avg: 112 },
];

export default function Insights() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Weekly Insights</h2>
                <p className="text-slate-500">Analyze your trends and glucose stability.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Glucose Spikes per Day</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="spikes" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.spikes > 2 ? '#EF4444' : '#3B82F6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>AI Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800">
                            <span className="font-semibold block mb-1">Weekly Analysis</span>
                            Your glucose stability has improved by 15% compared to last week. The spike on Wednesday correlates with high stress levels recorded.
                        </div>

                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-emerald-800">
                            <span className="font-semibold block mb-1">Recommendation</span>
                            Keep up the good work with breakfast! Your post-meal readings are consistently in range when you eat oatmeal.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
