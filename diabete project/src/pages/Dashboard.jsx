import { useState, useEffect, useRef } from 'react';
import { Plus, Footprints, Syringe, Droplet, Activity as ActivityIcon, Utensils, Zap as StressIcon, Phone, AlertTriangle } from 'lucide-react';
import GlucoseChart from '../components/GlucoseChart';
import MetabolicFactors from '../components/MetabolicFactors';
import AIBrainVisual from '../components/AIBrainVisual';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { generateGlucoseData, metrics, userData } from '../data/mockData';
import { triggerEmergencyCall } from '../lib/api';

const CRITICAL_DURATION_MINUTES = 15;
const [LOW_THRESHOLD, HIGH_THRESHOLD] = userData.targetRange;

function getCriticalType(glucose) {
    if (glucose === '--' || typeof glucose !== 'number') return null;
    if (glucose < LOW_THRESHOLD) return 'low';
    if (glucose > HIGH_THRESHOLD) return 'high';
    return null;
}

export default function Dashboard() {
    const [glucoseData, setGlucoseData] = useState([]);
    const [criticalMinutes, setCriticalMinutes] = useState(0);
    const [emergencyCallSent, setEmergencyCallSent] = useState(false);
    const [emergencyCalling, setEmergencyCalling] = useState(false);
    const [emergencyError, setEmergencyError] = useState(null);
    const criticalTypeRef = useRef(null);
    const timerRef = useRef(null);

    // Simulate real-time updates
    useEffect(() => {
        const data = generateGlucoseData();
        setGlucoseData(data);
    }, []);

    const currentGlucose = glucoseData.length > 0 ? glucoseData[glucoseData.length - 1].value : '--';
    const trend = glucoseData.length > 2
        ? (glucoseData[glucoseData.length - 1].value - glucoseData[glucoseData.length - 2].value) > 0 ? '↗' : '↘'
        : '→';

    const criticalType = getCriticalType(currentGlucose);
    const isCritical = criticalType !== null;
    const emergencyCalledRef = useRef(false);

    // Track duration in critical range and trigger emergency call at 15 min
    useEffect(() => {
        if (!isCritical) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            setCriticalMinutes(0);
            setEmergencyCallSent(false);
            emergencyCalledRef.current = false;
            criticalTypeRef.current = null;
            return;
        }
        criticalTypeRef.current = criticalType;

        if (!timerRef.current) {
            timerRef.current = setInterval(() => {
                setCriticalMinutes((m) => {
                    const next = m + 1;
                    if (next >= CRITICAL_DURATION_MINUTES && !emergencyCalledRef.current) {
                        emergencyCalledRef.current = true;
                        setEmergencyCallSent(true);
                        triggerEmergencyCall(currentGlucose, next, criticalTypeRef.current).catch((err) => {
                            setEmergencyError(err.message);
                        });
                    }
                    return next;
                });
            }, 60 * 1000); // every 1 minute
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [isCritical, currentGlucose]);

    const handleCallEmergencyNow = async () => {
        setEmergencyError(null);
        setEmergencyCalling(true);
        try {
            await triggerEmergencyCall(currentGlucose, Math.max(criticalMinutes, 1), criticalType);
            setEmergencyCallSent(true);
        } catch (err) {
            setEmergencyError(err.message);
        } finally {
            setEmergencyCalling(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Critical glucose emergency alert */}
            {isCritical && (
                <Card className="border-red-200 bg-red-50 shadow-md">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-red-100">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-red-900">
                                    {criticalType === 'low' ? 'Low' : 'High'} glucose alert
                                </p>
                                <p className="text-sm text-red-700 mt-0.5">
                                    Current: {currentGlucose} mg/dL — {criticalType === 'low' ? 'Below' : 'Above'} target ({LOW_THRESHOLD}–{HIGH_THRESHOLD} mg/dL).
                                    {criticalMinutes > 0 && (
                                        <> Critical for {criticalMinutes} min. Emergency call {criticalMinutes >= CRITICAL_DURATION_MINUTES ? 'triggered.' : `will trigger after ${CRITICAL_DURATION_MINUTES} min.`}</>
                                    )}
                                </p>
                                {emergencyError && (
                                    <p className="text-sm text-red-600 mt-1">{emergencyError}</p>
                                )}
                            </div>
                        </div>
                        {!emergencyCallSent && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-red-300 text-red-700 hover:bg-red-100 shrink-0"
                                onClick={handleCallEmergencyNow}
                                disabled={emergencyCalling}
                            >
                                <Phone className="h-4 w-4 mr-2" />
                                {emergencyCalling ? 'Calling…' : 'Call emergency now'}
                            </Button>
                        )}
                        {emergencyCallSent && (
                            <Badge className="bg-red-200 text-red-800 shrink-0">Emergency call sent</Badge>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500">Welcome back, Salaheddine</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button size="sm" className="flex-1 md:flex-none gap-2">
                        <Plus className="h-4 w-4" /> Log Glucose
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1 md:flex-none gap-2">
                        <Plus className="h-4 w-4" /> Add Meal
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Avg Glucose"
                    value={`${metrics.avgGlucose} mg/dL`}
                    IconProp={Droplet}
                    color="text-blue-500"
                    bgColor="bg-blue-50"
                />
                <MetricCard
                    title="Time in Range"
                    value={metrics.timeInRange}
                    IconProp={ActivityIcon}
                    color="text-green-500"
                    bgColor="bg-green-50"
                />
                <MetricCard
                    title="Active Steps"
                    value={metrics.steps.toLocaleString()}
                    IconProp={Footprints}
                    color="text-orange-500"
                    bgColor="bg-orange-50"
                />
                <MetricCard
                    title="Insulin on Board"
                    value={`${metrics.insulinOnBoard} U`}
                    IconProp={Syringe}
                    color="text-purple-500"
                    bgColor="bg-purple-50"
                />
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <GlucoseChart data={glucoseData} />
                <MetabolicFactors />
            </div>

            {/* AI Brain Visual */}
            <div className="grid grid-cols-1">
                <AIBrainVisual />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Current Status Card */}
                <Card className="col-span-1 bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-black/10 blur-xl"></div>
                    <CardHeader>
                        <CardTitle className="text-primary-100 relative z-10">Current Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8 relative z-10">
                        <div className="text-6xl font-bold tracking-tighter mb-2">
                            {currentGlucose}
                        </div>
                        <div className="text-xl font-medium text-primary-100 mb-6">
                            mg/dL <span className="text-2xl ml-2">{trend}</span>
                        </div>
                        <Badge
                            variant="secondary"
                            className={
                                criticalType === 'low'
                                    ? 'bg-amber-500/80 text-white border-0 px-4 py-1.5 text-sm'
                                    : criticalType === 'high'
                                    ? 'bg-red-500/80 text-white border-0 px-4 py-1.5 text-sm'
                                    : 'bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-1.5 text-sm backdrop-blur-md'
                            }
                        >
                            {criticalType === 'low' ? 'Low' : criticalType === 'high' ? 'High' : 'In Range'}
                        </Badge>
                        <p className="mt-8 text-sm text-primary-100 text-center">
                            Predicted to stay stable for the next 2 hours based on recent activity.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Row */}
            <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-800">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <QuickAction IconProp={Utensils} label="Add Meal" color="bg-emerald-100 text-emerald-700" />
                    <QuickAction IconProp={Syringe} label="Insulin" color="bg-purple-100 text-purple-700" />
                    <QuickAction IconProp={ActivityIcon} label="Exercise" color="bg-orange-100 text-orange-700" />
                    <QuickAction IconProp={StressIcon} label="Stress" color="bg-rose-100 text-rose-700" />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, IconProp, color, bgColor }) {
    if (!IconProp) return null;
    return (
        <Card>
            <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                    <div className={`p-2 rounded-lg ${bgColor} ${color}`}>
                        <IconProp className="h-4 w-4" />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-slate-900">{value}</div>
                    <p className="text-xs font-medium text-slate-500">{title}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickAction({ IconProp, label, color }) {
    if (!IconProp) return null;
    return (
        <button className={`flex flex-col items-center justify-center p-4 rounded-xl transition-transform hover:scale-105 active:scale-95 ${color}`}>
            <IconProp className="h-6 w-6 mb-2" />
            <span className="text-sm font-semibold">{label}</span>
        </button>
    )
}
