import { Brain, Utensils, Activity, Zap, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

export default function AIBrainVisual() {
    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
            <CardHeader>
                <CardTitle>AI Personalized Metabolic Model</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* Inputs */}
                    <div className="flex flex-col gap-3 w-full md:w-1/3">
                        <div className="text-sm font-semibold text-slate-500 text-center mb-2">Live Inputs</div>
                        <InputItem icon={Utensils} label="Food Data" color="bg-emerald-100 text-emerald-600" />
                        <InputItem icon={Activity} label="CGM Data" color="bg-blue-100 text-blue-600" />
                        <InputItem icon={Zap} label="Stress Level" color="bg-orange-100 text-orange-600" />
                        <InputItem icon={Pill} label="Medication" color="bg-purple-100 text-purple-600" />
                    </div>

                    {/* Brain Processing */}
                    <div className="flex flex-col items-center justify-center relative">
                        <div className="hidden md:block absolute left-[-40px] top-1/2 -translate-y-1/2 w-8 border-t-2 border-dashed border-slate-300"></div>
                        <div className="hidden md:block absolute right-[-40px] top-1/2 -translate-y-1/2 w-8 border-t-2 border-dashed border-slate-300"></div>

                        <div className="h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center relative z-20 animate-pulse">
                            <Brain className="h-12 w-12 text-primary-500" />
                        </div>
                        <div className="mt-3 text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Processing
                        </div>
                    </div>

                    {/* Outputs */}
                    <div className="flex flex-col gap-3 w-full md:w-1/3">
                        <div className="text-sm font-semibold text-slate-500 text-center mb-2">Real-Time Predictions</div>
                        <OutputItem label="Glucose Spike Prediction" value="Moderate Rise (140 mg/dL)" />
                        <OutputItem label="Personalized Food Rec" value="Add Fiber / Protein" />
                        <OutputItem label="CGM Bias Detection" value="Calibrated" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function InputItem({ icon: Icon, label, color }) {
    return (
        <div className="flex items-center gap-3 p-2 bg-white/50 rounded-lg border border-slate-100 shadow-sm">
            <div className={`p-1.5 rounded-md ${color}`}>
                <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
    )
}

function OutputItem({ label, value }) {
    return (
        <div className="flex flex-col p-2 bg-white/50 rounded-lg border border-slate-100 shadow-sm">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-800">{value}</span>
        </div>
    )
}
