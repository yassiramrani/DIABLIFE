import { User, Settings, Bell, Shield, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { userData } from '../data/mockData';

export default function Profile() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-2xl font-bold">
                    {userData.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{userData.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default">{userData.type}</Badge>
                        <span className="text-sm text-slate-500">Member since 2024</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary-500" />
                            Medical Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ProfileRow label="Insulin Sensitivity" value={userData.sensitivity} />
                        <ProfileRow label="Target Range" value={`${userData.targetRange[0]} - ${userData.targetRange[1]} mg/dL`} />
                        <ProfileRow label="Correction Factor" value="1:40" />
                        <ProfileRow label="Basal Rate" value="0.8 U/hr" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-slate-500" />
                            App Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-slate-600">
                            <Bell className="mr-2 h-4 w-4" /> Notifications
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-slate-600">
                            <Shield className="mr-2 h-4 w-4" /> Privacy & Security
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ProfileRow({ label, value }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
            <span className="text-sm font-medium text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-900">{value}</span>
        </div>
    );
}
