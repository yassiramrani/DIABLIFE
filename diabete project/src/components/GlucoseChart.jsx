import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

export default function GlucoseChart({ data }) {
    // We add a mock 'insulin' curve to match the image's dual-line setup
    const enhancedData = data.map(d => ({
        ...d,
        insulin: 0.5 + Math.sin(d.value / 20) * 0.4 + (d.value > 150 ? 0.4 : 0)
    }));

    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={enhancedData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    
                    {/* Pink/Blue Background Zones */}
                    <ReferenceArea y1={0} y2={60} fill="#fce7f3" fillOpacity={0.6} />
                    <ReferenceArea y1={60} y2={140} fill="#ede9fe" fillOpacity={0.6} />
                    <ReferenceArea y1={140} y2={200} fill="#f1f5f9" fillOpacity={0.4} />

                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                        dy={10}
                    />
                    
                    {/* Glucose Y Axis (Left) */}
                    <YAxis
                        yAxisId="left"
                        domain={[0, 160]}
                        tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        width={30}
                        tickCount={5}
                    />
                    
                    {/* Insulin Y Axis (Right) - Match visual from image */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0.4, 1.8]}
                        tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        width={30}
                        tickCount={5}
                    />
                    
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 600 }}
                    />

                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="value"
                        name="Glucose"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fill="none"
                        dot={false}
                        activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                    />
                    
                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="insulin"
                        name="Insulin"
                        stroke="#d946ef"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        fill="none"
                        dot={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
