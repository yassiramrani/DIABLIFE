import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUserProfile } from '../lib/firestore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Camera, Activity, ShieldAlert, ArrowRight, Check } from 'lucide-react';

const DEMO_STEPS = [
    {
        title: "Visual Food Intelligence",
        description: "Snap a photo of your meal. Our AI powered by Gemini 2.5 Flash analyzes the food, estimates portion sizes, and counts the carbs instantly.",
        icon: Camera,
        color: "text-blue-500 bg-blue-100"
    },
    {
        title: "Predictive Metabolic Insights",
        description: "Get real-time predictions on how your meal will impact your glucose levels. Know before you eat if a meal will cause a rapid spike or stable response.",
        icon: Activity,
        color: "text-green-500 bg-green-100"
    },
    {
        title: "Emergency Safety Net",
        description: "Your silent guardian. If your logs indicate severe untreated lows, our automated system can trigger emergency voice calls to your contacts.",
        icon: ShieldAlert,
        color: "text-red-500 bg-red-100"
    }
];

export default function Onboarding() {
    const [step, setStep] = useState(0); 
    // step 0-2: Demo carousel
    // step 3: Stats form
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [weight, setWeight] = useState('');
    const [dailyCarbsLimit, setDailyCarbsLimit] = useState(150);
    const [dailySugarLimit, setDailySugarLimit] = useState(30);

    const handleNext = () => {
        if (step < DEMO_STEPS.length) {
            setStep(s => s + 1);
        }
    };

    const handleFinish = async (e) => {
        e.preventDefault();
        if (!user) return;
        
        setIsLoading(true);
        try {
            await createUserProfile(user.uid, {
                weight: Number(weight) || null,
                dailyCarbsLimit: Number(dailyCarbsLimit),
                dailySugarLimit: Number(dailySugarLimit),
                onboardingCompleted: true
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving onboarding stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {step < DEMO_STEPS.length ? (
                    <Card className="border-0 shadow-xl overflow-hidden">
                        <div className="h-2 w-full bg-slate-100">
                            <div 
                                className="h-full bg-primary-500 transition-all duration-300 ease-out"
                                style={{ width: `${((step + 1) / (DEMO_STEPS.length + 1)) * 100}%` }}
                            />
                        </div>
                        <CardContent className="p-8 text-center space-y-6 flex flex-col items-center">
                            {DEMO_STEPS.map((demoStep, index) => {
                                const Icon = demoStep.icon;
                                return index === step && (
                                    <div key={index} className="space-y-6 animate-in zoom-in-95 duration-500">
                                        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${demoStep.color} mb-6`}>
                                            <Icon className="w-10 h-10" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">{demoStep.title}</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            {demoStep.description}
                                        </p>
                                    </div>
                                );
                            })}
                            
                            <Button onClick={handleNext} className="w-full mt-8 group h-12 text-lg">
                                Continue 
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-0 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                        <div className="h-2 w-full bg-slate-100">
                            <div className="h-full bg-primary-500 w-full" />
                        </div>
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-2xl font-bold">Personalize Your AI</CardTitle>
                            <CardDescription>
                                Set your targets so DiaBLife can give you personalized warnings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleFinish} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="weight">
                                        Weight (kg) - Optional
                                    </label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        placeholder="70"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="h-12"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="dailyCarbsLimit">
                                        Target Daily Carbs Limit (g)
                                    </label>
                                    <Input
                                        id="dailyCarbsLimit"
                                        type="number"
                                        value={dailyCarbsLimit}
                                        onChange={(e) => setDailyCarbsLimit(e.target.value)}
                                        required
                                        className="h-12 border-primary-200 focus-visible:ring-primary-500 bg-primary-50/30"
                                    />
                                    <p className="text-xs text-slate-500">Our AI will warn you if a meal pushes you over this limit.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="dailySugarLimit">
                                        Target Daily Sugar Limit (g)
                                    </label>
                                    <Input
                                        id="dailySugarLimit"
                                        type="number"
                                        value={dailySugarLimit}
                                        onChange={(e) => setDailySugarLimit(e.target.value)}
                                        required
                                        className="h-12 border-primary-200 focus-visible:ring-primary-500 bg-primary-50/30"
                                    />
                                    <p className="text-xs text-slate-500">Typically kept under 30g for better control.</p>
                                </div>

                                <Button type="submit" className="w-full mt-4 h-12 text-lg bg-green-600 hover:bg-green-700 text-white" isLoading={isLoading}>
                                    <Check className="mr-2 w-5 h-5" />
                                    Complete Setup
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
