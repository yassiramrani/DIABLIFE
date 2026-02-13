import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

export default function GlucoseChart({ data }) {
    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Live Glucose Monitoring</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        Last reading: 2 min ago
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 10,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                domain={[40, 300]}
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                tickLine={false}
                                axisLine={false}
                                width={30}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#3B82F6', fontWeight: 600 }}
                            />

                            {/* Target Range Background (This is tricky with just LineChart, ReferenceLine is better for lines) */}
                            <ReferenceLine y={180} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'right', value: 'High', fill: '#EF4444', fontSize: 10 }} />
                            <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Low', fill: '#EF4444', fontSize: 10 }} />

                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
