import { User, Settings, Bell, Shield, LogOut, Activity, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { userData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserProfile, createUserProfile } from '../lib/firestore';

export default function Profile() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.uid) {
                try {
                    const profile = await getUserProfile(user.uid);
                    if (profile) {
                        setUserProfile(profile);
                        setEmergencyContact(profile.emergencyContact || "");
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            }
        };
        fetchProfile();
    }, [user]);

    const [emergencyContact, setEmergencyContact] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    const handleSaveProfile = async () => {
        if (!user?.uid) return;
        setIsSaving(true);
        setSaveStatus(null);
        try {
            await createUserProfile(user.uid, {
                emergencyContact: emergencyContact
            });
            setSaveStatus("success");
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Use profile data if available, otherwise fall back to user email or mock data
    const displayName = userProfile?.name || user?.email || userData.name;
    const displayType = userProfile?.diabetesType || userData.type;
    const displayInitial = displayName.charAt(0).toUpperCase();

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
            {/* Clinical Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="h-24 w-24 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner">
                    <User className="h-12 w-12" />
                </div>
                
                <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{displayName}</h2>
                            <p className="text-slate-500 font-medium">Patient Reference Profile</p>
                        </div>
                        <div className="flex gap-2">
                             <Badge variant="outline" className="rounded-md border-primary-200 text-primary-700 font-bold bg-primary-50 px-3 py-1">
                                {displayType}
                             </Badge>
                             <Badge variant="outline" className="rounded-md px-3 py-1 border-slate-200 text-slate-500 font-bold">
                                ID: {user?.uid?.slice(0, 8).toUpperCase() || 'REF-821'}
                             </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-500 pt-1">
                        <span className="flex items-center gap-1.5 font-medium">
                            <Calendar className="h-4 w-4" /> Registered Dec {new Date().getFullYear() - 1}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                            <Shield className="h-4 w-4" /> Verified Patient
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Clinical Parameters Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/80 border-b border-slate-200 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary-600" /> Clinical Parameters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                        <th className="px-6 py-3">Parameter</th>
                                        <th className="px-6 py-3 text-right">Reference Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <ClinicalRow label="Insulin Sensitivity" value={userData.sensitivity} />
                                    <ClinicalRow label="Target Range" value={`${userData.targetRange[0]} - ${userData.targetRange[1]} mg/dL`} />
                                    <ClinicalRow label="Correction Factor" value="1:40 U/mg" />
                                    <ClinicalRow label="Basal Rate" value="0.85 Units/hr" />
                                    <ClinicalRow label="A1C (Current)" value="5.8%" />
                                    <tr className="bg-red-50/20">
                                        <td className="px-6 py-4 text-sm font-bold text-red-600 italic">Emergency Contact</td>
                                        <td className="px-6 py-4 text-right">
                                            <input 
                                                type="tel" 
                                                className="bg-white border border-red-100 rounded px-3 py-1 text-sm font-bold text-red-900 w-36 text-right focus:outline-none focus:ring-2 focus:ring-red-200"
                                                placeholder="+33 6..."
                                                value={emergencyContact}
                                                onChange={(e) => setEmergencyContact(e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
                                {saveStatus === 'success' && <span className="text-xs text-emerald-600 font-bold self-center">Changes saved!</span>}
                                {saveStatus === 'error' && <span className="text-xs text-red-600 font-bold self-center">Update failed.</span>}
                                <Button size="sm" onClick={handleSaveProfile} isLoading={isSaving} className="h-9 px-6 rounded-lg font-bold">
                                    Save Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/80 border-b border-slate-200 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-secondary-600" /> Recent Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Avg Glucose (7d)</p>
                                <p className="text-2xl font-bold text-slate-800">108 <span className="text-sm font-medium text-slate-400 ml-1">mg/dL</span></p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Time in Range</p>
                                <p className="text-2xl font-bold text-slate-800">92 <span className="text-sm font-medium text-slate-400 ml-1">%</span></p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Settings Column */}
                <div className="space-y-6">
                    <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                        <CardHeader className="bg-slate-50/80 border-b border-slate-200 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Settings className="h-5 w-5 text-slate-500" /> Security & Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            <Button variant="ghost" className="w-full justify-start text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg px-4 h-11">
                                <Bell className="mr-3 h-4 w-4 text-slate-400" /> App Notifications
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg px-4 h-11">
                                <Shield className="mr-3 h-4 w-4 text-slate-400" /> Privacy Center
                            </Button>
                            
                            <div className="pt-8 px-2">
                                <div className="border-t border-slate-100 mb-6"></div>
                                <Button
                                    variant="outline"
                                    className="w-full justify-center text-sm font-bold text-red-600 hover:bg-red-50 border-slate-200 h-12 rounded-lg"
                                    onClick={handleLogout}
                                    isLoading={isLoading}
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> Sign Out Session
                                </Button>
                                <p className="text-[10px] text-center text-slate-400 mt-4 font-medium italic">
                                     Secure logout. Your data is encrypted locally.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ClinicalRow({ label, value }) {
    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4 text-sm font-semibold text-slate-600">{label}</td>
            <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{value}</td>
        </tr>
    );
}
