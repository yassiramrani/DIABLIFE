import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../lib/firestore';
import { getTodayTotals } from '../lib/foodLogService';
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
    const { user } = useAuth();
    const [userName, setUserName] = useState(user?.displayName || 'User');
    const [userLimits, setUserLimits] = useState({ dailyCarbsLimit: 150, dailySugarLimit: 30 });
    const [todayTotals, setTodayTotals] = useState({ totalCarbs: 0, totalSugar: 0 });
    const [glucoseData, setGlucoseData] = useState([]);
    const [criticalMinutes, setCriticalMinutes] = useState(0);
    const [emergencyCallSent, setEmergencyCallSent] = useState(false);
    const [emergencyCalling, setEmergencyCalling] = useState(false);
    const [emergencyError, setEmergencyError] = useState(null);
    const criticalTypeRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.uid) {
                try {
                    const profile = await getUserProfile(user.uid);
                    if (profile) {
                        setUserName(profile.name || user.displayName || 'User');
                        setUserLimits({
                            dailyCarbsLimit: profile.dailyCarbsLimit || 150,
                            dailySugarLimit: profile.dailySugarLimit || 30
                        });
                    } else if (user.displayName) {
                        setUserName(user.displayName);
                    }
                    const totals = await getTodayTotals(user.uid);
                    setTodayTotals(totals);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
        };
        fetchUserData();
    }, [user]);

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
                            // Enhance error message for end user
                            const msg = err.message.includes('503')
                                ? "Emergency service unavailable (Check server config)"
                                : err.message;
                            setEmergencyError(msg);
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
            console.error(err);
            const msg = err.message.includes('503') || err.message.includes('Failed to fetch')
                ? "Emergency service unavailable. (Is the backend server running and configured?)"
                : err.message;
            setEmergencyError(msg);
        } finally {
            setEmergencyCalling(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500 w-full mb-8">
            
            {/* Left Column - Main Dashboard Area */}
            <div className="flex-1 space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Good Morning, {userName}
                        </h2>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                            <span>Last sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="mx-2">•</span>
                            <span className="text-emerald-600 font-medium">Pump connected</span>
                        </div>
                    </div>
                </div>

                {/* Critical glucose emergency alert (Keep existing functionality, adapt style) */}
                {isCritical && (
                    <Card className="border-red-200 bg-red-50 shadow-sm rounded-xl overflow-hidden">
                        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-full bg-red-100 flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-red-900">
                                        {criticalType === 'low' ? 'Low' : 'High'} glucose alert
                                    </p>
                                    <p className="text-sm text-red-700 mt-0.5">
                                        Current: {currentGlucose} mg/dL — {criticalType === 'low' ? 'Below' : 'Above'} target.
                                        {criticalMinutes > 0 && ` Critical for ${criticalMinutes} min.`}
                                    </p>
                                </div>
                            </div>
                            {!emergencyCallSent && (
                                <Button size="sm" variant="destructive" className="shrink-0" onClick={handleCallEmergencyNow} disabled={emergencyCalling}>
                                    <Phone className="h-4 w-4 mr-2" />
                                    {emergencyCalling ? 'Calling…' : 'Emergency'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Chart Section */}
                <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-50">
                        <CardTitle className="text-sm font-semibold text-slate-700">Glucose & Insulin Over Time</CardTitle>
                        <div className="flex items-center gap-4 text-xs font-medium bg-slate-50 p-1 rounded-lg">
                            <button className="px-3 py-1 rounded bg-white shadow-sm text-slate-800">1 hr</button>
                            <button className="px-3 py-1 text-slate-500 hover:text-slate-800">6 hr</button>
                            <button className="px-3 py-1 text-slate-500 hover:text-slate-800">24 hr</button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* We will update GlucoseChart internally in the next step to match the aesthetic */}
                        <div className="px-4 py-6">
                            <GlucoseChart data={glucoseData} />
                        </div>
                    </CardContent>
                </Card>

                {/* 4-Grid Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Current Glucose */}
                    <MetricCardLight 
                        title="Current Glucose Levels"
                        value={<>{currentGlucose}<span className="text-lg font-medium text-slate-500 ml-1">mg/dL</span></>}
                        subtitle={<span className="text-slate-500">Stable · Last reading Just now</span>}
                        iconBg="bg-blue-100 ring-4 ring-blue-50"
                        icon={<Droplet className="h-5 w-5 text-blue-600" fill="currentColor" />}
                    />
                    
                    {/* Insulin in Body */}
                    <MetricCardLight 
                        title="Insulin in Body"
                        value={<>3.1<span className="text-lg font-medium text-slate-500 ml-1">u</span></>}
                        subtitle={<span className="text-slate-500">Basal mode active</span>}
                        iconBg="bg-rose-100 ring-4 ring-rose-50"
                        icon={<ActivityIcon className="h-5 w-5 text-rose-500" />}
                    />
                    
                    {/* Next Insulin Dose */}
                    <MetricCardLight 
                        title="Next Insulin Dose"
                        value={<>2.0<span className="text-lg font-medium text-slate-500 ml-1">u</span></>}
                        subtitle={<span className="text-slate-500">Scheduled for 12:30 PM</span>}
                        iconBg="bg-emerald-100 ring-4 ring-emerald-50"
                        icon={<Syringe className="h-5 w-5 text-emerald-600" />}
                    />
                    
                    {/* Latest Warning */}
                    <MetricCardLight 
                        title="Latest Warning"
                        value={
                            <div className="flex items-end gap-2">
                                <span>62<span className="text-lg font-medium text-slate-500 ml-1">mg/dL</span></span>
                                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100 mb-1 border-0">Low</Badge>
                            </div>
                        }
                        subtitle={<span className="text-slate-500">Occurred 4:50 AM · Resolved 5:00 AM</span>}
                        iconBg="bg-purple-100 ring-4 ring-purple-50"
                        icon={<AlertTriangle className="h-5 w-5 text-purple-600" />}
                    />
                </div>
            </div>

            {/* Right Column - Side Panel */}
            <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
                
                {/* User Profile Header Mini */}
                <div className="hidden lg:flex justify-end items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center relative shadow-sm">
                         <div className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                         <AlertTriangle className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="px-4 py-2 bg-white rounded-full shadow-sm flex items-center gap-2 border border-slate-100">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`} alt="Avatar" />
                        </div>
                        <span className="font-semibold text-sm text-slate-800">{userName}</span>
                    </div>
                </div>

                {/* Food Tracking Panel - Matches design */}
                <Card className="rounded-[24px] bg-[#EAF3FE] border-0 shadow-none overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
                        <CardTitle className="text-base font-bold text-slate-800">Food & Carb Tracking</CardTitle>
                        <Button size="sm" className="h-8 text-xs rounded-full bg-slate-900 hover:bg-slate-800 text-white px-3 shadow-md">
                            <Plus className="h-3 w-3 mr-1" /> Add log
                        </Button>
                    </CardHeader>
                    <CardContent className="px-4 pb-6 pt-2 space-y-3">
                        {/* Summary of limits integrated cleanly */}
                        <div className="flex justify-between items-center px-2 mb-3">
                            <div className="text-xs font-semibold text-slate-500">TODAY</div>
                            <div className="text-xs font-bold text-blue-600">{todayTotals.totalCarbs}g / {userLimits.dailyCarbsLimit}g</div>
                        </div>

                        {/* Recent Meals Mockup inside container */}
                        <MealItem time="9:20 AM" title="Oatmeal Breakfast" carbs="36g carbs" icon="🥣" color="bg-blue-100" />
                        <MealItem time="9:20 AM" title="Orange Juice" carbs="27g carbs" icon="🍹" color="bg-orange-100" />
                        <MealItem time="2:20 PM" title="Sandwich" carbs="32g carbs" icon="🥪" color="bg-emerald-100" />
                    </CardContent>
                </Card>

                {/* Insulin Schedule Panel */}
                <Card className="rounded-[24px] bg-gradient-to-b from-[#EAEUFD] to-[#E9EAFF] border-0 shadow-none overflow-hidden pb-4">
                    <CardHeader className="pb-0 pt-6 px-6">
                        <CardTitle className="text-base font-bold text-slate-800">Insulin Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pt-4">
                        <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                            <div className="h-24 w-full flex justify-center items-center mb-4 relative">
                                <div className="absolute top-2 left-1/4 animate-bounce shrink-0 delay-100 text-2xl">⏰</div>
                                <div className="text-6xl z-10">💉</div>
                                <div className="absolute bottom-2 right-1/4 animate-bounce shrink-0 text-3xl">💊</div>
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-6 leading-tight">
                                The next insulin dose<br/>schedule is at 12:30.
                            </h4>
                            <Button className="w-full rounded-2xl h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                                I took the dose.
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

function MetricCardLight({ title, value, subtitle, iconBg, icon }) {
    return (
        <Card className="rounded-2xl border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${iconBg}`}>
                        {icon}
                    </div>
                    <p className="font-semibold text-slate-600 text-sm">{title}</p>
                </div>
                <div className="mt-2">
                    <div className="text-3xl font-bold text-slate-900 leading-none tracking-tight">
                        {value}
                    </div>
                </div>
                <div className="mt-4 text-xs font-medium">
                    {subtitle}
                </div>
            </CardContent>
        </Card>
    );
}

function MealItem({ time, title, carbs, icon, color }) {
    return (
        <div className="bg-white rounded-[20px] p-4 flex items-center gap-4 shadow-sm">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl shrink-0 ${color}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400 mb-0.5">{time}</p>
                <div className="flex items-center gap-1.5 truncate">
                    <span className="font-bold text-slate-800 text-sm truncate">{title}</span>
                    <span className="text-xs font-medium text-slate-400 shrink-0">• {carbs}</span>
                </div>
            </div>
        </div>
    );
}
