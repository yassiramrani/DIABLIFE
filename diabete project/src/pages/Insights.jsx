import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line,
    ReferenceLine,
} from 'recharts';
import {
    Droplet,
    Target,
    TrendingUp,
    TrendingDown,
    Minus,
    Zap,
    AlertCircle,
    Calendar,
    Sparkles,
    Award,
    Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
    userData,
    insightStats,
    weeklyGlucoseData,
    aiInsightSummary,
} from '../data/mockData';

const [LOW, HIGH] = userData.targetRange;

function StatCard({ title, value, subValue, icon: Icon, color, bgColor, trend }) {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor =
        trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-amber-600' : 'text-slate-500';
    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-md">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-xl ${bgColor} ${color}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    {subValue != null && (
                        <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
                            <TrendIcon className="h-3.5 w-3.5" />
                            {subValue}
                        </span>
                    )}
                </div>
                <div className="mt-3">
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{title}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Insights() {
    const TrendBadgeIcon =
        insightStats.trend === 'improving'
            ? TrendingUp
            : insightStats.trend === 'worsening'
            ? TrendingDown
            : Minus;
    const trendLabel =
        insightStats.trend === 'improving'
            ? 'Improving'
            : insightStats.trend === 'worsening'
            ? 'Needs attention'
            : 'Stable';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header with user context */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Insights</h2>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {userData.name.split(' ')[0]}’s stats · {insightStats.period}
                    </p>
                </div>
                <Badge
                    variant="secondary"
                    className="w-fit bg-primary-50 text-primary-700 border-primary-200 gap-1.5"
                >
                    <TrendBadgeIcon className="h-3.5 w-3.5" />
                    {trendLabel}
                </Badge>
            </div>

            {/* Top stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Avg glucose"
                    value={`${insightStats.avgGlucose} mg/dL`}
                    subValue={
                        insightStats.avgGlucose < insightStats.avgGlucoseLastWeek
                            ? `↓ ${insightStats.avgGlucoseLastWeek - insightStats.avgGlucose} vs last week`
                            : null
                    }
                    icon={Droplet}
                    color="text-primary-600"
                    bgColor="bg-primary-50"
                    trend={
                        insightStats.avgGlucose < insightStats.avgGlucoseLastWeek
                            ? 'down'
                            : insightStats.avgGlucose > insightStats.avgGlucoseLastWeek
                            ? 'up'
                            : null
                    }
                />
                <StatCard
                    title="Time in range"
                    value={`${insightStats.timeInRange}%`}
                    subValue={
                        insightStats.timeInRange > insightStats.timeInRangeLastWeek
                            ? `↑ ${insightStats.timeInRange - insightStats.timeInRangeLastWeek}%`
                            : null
                    }
                    icon={Target}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                    trend={
                        insightStats.timeInRange > insightStats.timeInRangeLastWeek
                            ? 'up'
                            : insightStats.timeInRange < insightStats.timeInRangeLastWeek
                            ? 'down'
                            : null
                    }
                />
                <StatCard
                    title="Spikes"
                    value={insightStats.totalSpikes}
                    subValue="this week"
                    icon={Zap}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <StatCard
                    title="Low events"
                    value={insightStats.totalLows}
                    subValue="this week"
                    icon={AlertCircle}
                    color="text-rose-600"
                    bgColor="bg-rose-50"
                />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Glucose spikes per day */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-slate-900">Glucose spikes per day</CardTitle>
                        <p className="text-sm text-slate-500 font-normal mt-1">
                            Readings above {HIGH} mg/dL
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={weeklyGlucoseData}
                                    margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#E2E8F0"
                                    />
                                    <XAxis
                                        dataKey="short"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#64748B' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        width={24}
                                        tick={{ fontSize: 11, fill: '#64748B' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: 'none',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        }}
                                        formatter={(value) => [value, 'Spikes']}
                                        labelFormatter={(_, payload) =>
                                            payload?.[0]?.payload?.day ?? ''
                                        }
                                    />
                                    <Bar dataKey="spikes" radius={[6, 6, 0, 0]} maxBarSize={40}>
                                        {weeklyGlucoseData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    entry.spikes > 2
                                                        ? '#F59E0B'
                                                        : entry.spikes === 0
                                                        ? '#10B981'
                                                        : '#3B82F6'
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm bg-primary-500" /> Normal
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> High spikes
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> None
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Daily average glucose */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-slate-900">Daily average glucose</CardTitle>
                        <p className="text-sm text-slate-500 font-normal mt-1">
                            Target range: {LOW}–{HIGH} mg/dL
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={weeklyGlucoseData}
                                    margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#E2E8F0"
                                    />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#64748B' }}
                                    />
                                    <YAxis
                                        domain={[80, 180]}
                                        axisLine={false}
                                        tickLine={false}
                                        width={32}
                                        tick={{ fontSize: 11, fill: '#64748B' }}
                                    />
                                    <ReferenceLine
                                        y={HIGH}
                                        stroke="#F59E0B"
                                        strokeDasharray="3 3"
                                        strokeOpacity={0.8}
                                    />
                                    <ReferenceLine
                                        y={LOW}
                                        stroke="#EF4444"
                                        strokeDasharray="3 3"
                                        strokeOpacity={0.8}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: 'none',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        }}
                                        formatter={(value) => [`${value} mg/dL`, 'Avg']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="avg"
                                        stroke="#3B82F6"
                                        strokeWidth={2.5}
                                        dot={{ fill: '#3B82F6', strokeWidth: 0, r: 4 }}
                                        activeDot={{ r: 5, fill: '#2563EB' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Time in range bars + best/worst day */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Time in range by day</CardTitle>
                        <p className="text-sm text-slate-500 font-normal mt-1">
                            % of readings within {LOW}–{HIGH} mg/dL
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {weeklyGlucoseData.map((row) => (
                                <div key={row.day} className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-slate-600 w-10">
                                        {row.day}
                                    </span>
                                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${row.timeInRange}%`,
                                                backgroundColor:
                                                    row.timeInRange >= 80
                                                        ? '#10B981'
                                                        : row.timeInRange >= 60
                                                        ? '#F59E0B'
                                                        : '#EF4444',
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 w-10 text-right">
                                        {row.timeInRange}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0 shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                    <CardHeader>
                        <CardTitle className="text-primary-100 text-base">Week at a glance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-white/20">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Best day</p>
                                <p className="text-primary-100 text-sm">{insightStats.bestDay}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-white/20">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Watch</p>
                                <p className="text-primary-100 text-sm">{insightStats.worstDay}</p>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-white/20">
                            <p className="text-primary-100 text-sm">
                                <span className="font-semibold text-white">
                                    {insightStats.streakDaysInRange} days
                                </span>{' '}
                                in a row in range
                            </p>
                        </div>
                        <p className="text-xs text-primary-200">
                            {insightStats.readingsLogged} readings logged
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Summary */}
            <Card className="border-primary-100 bg-gradient-to-b from-primary-50/50 to-white">
                <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary-500" />
                        AI Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 p-4 rounded-xl bg-white border border-primary-100 shadow-sm">
                        <div className="p-2 rounded-lg bg-primary-50 shrink-0 h-fit">
                            <TrendingUp className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-1">Weekly analysis</p>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {aiInsightSummary.weekly}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-white border border-emerald-100 shadow-sm">
                        <div className="p-2 rounded-lg bg-emerald-50 shrink-0 h-fit">
                            <Lightbulb className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-1">Recommendation</p>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {aiInsightSummary.recommendation}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                        <div className="p-2 rounded-lg bg-amber-100 shrink-0 h-fit">
                            <Award className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                            <p className="font-semibold text-amber-900 mb-1">Highlight</p>
                            <p className="text-amber-800 text-sm leading-relaxed">
                                {aiInsightSummary.highlight}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
