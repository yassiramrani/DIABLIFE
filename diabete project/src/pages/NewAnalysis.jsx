import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowRight, Check, AlertTriangle, Info, Utensils, Activity, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import SafeFoodsList from '../components/SafeFoodsList';
import { foodDatabase } from '../data/mockData';
import { logMeal, getTodayTotals } from '../lib/foodLogService';
import { getUserProfile } from '../lib/firestore';

// Helper badge component
function Badge({ variant = "default", className, children }) {
    const variants = {
        default: "bg-primary-100 text-primary-800 hover:bg-primary-200",
        secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
        outline: "border border-slate-200 text-slate-800 hover:bg-slate-50",
        danger: "bg-red-100 text-red-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-orange-100 text-orange-800",
    };
    const baseClass = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
    const variantClass = variants[variant] || variants.default;

    return (
        <div className={`${baseClass} ${variantClass} ${className}`}>
            {children}
        </div>
    );
}

export default function NewAnalysis() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const { user } = useAuth(); // Get user from context
    
    // User limits state
    const [userLimits, setUserLimits] = useState({ dailyCarbsLimit: 150, dailySugarLimit: 30 });
    const [todayTotals, setTodayTotals] = useState({ totalCarbs: 0, totalSugar: 0 });

    useEffect(() => {
        if (user) {
            getUserProfile(user.uid)
                .then(profile => {
                    if (profile) setUserLimits({ 
                        dailyCarbsLimit: profile.dailyCarbsLimit || 150, 
                        dailySugarLimit: profile.dailySugarLimit || 30 
                    });
                })
                .catch(err => console.error("Error fetching profile limits:", err));
                
            getTodayTotals(user.uid)
                .then(totals => {
                    setTodayTotals(totals);
                })
                .catch(err => console.error("Error fetching today totals:", err));
        }
    }, [user]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSelectedFood(null);
        setSelectedImage(null);
        setPreviewUrl(null);
        setPrediction(null);
        setError(null);
        setSuccessMsg(null);
    };

    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setSearchQuery(food.name);
        setPrediction(null);
        setError(null);
        setSuccessMsg(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setSelectedFood(null); // Clear manual selection if image is uploaded
            setPrediction(null);
            setError(null);
            setSuccessMsg(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFood && !selectedImage) return;
        setIsAnalyzing(true);
        setError(null);
        setPrediction(null);
        setSuccessMsg(null);

        try {
            if (!user) {
                throw new Error("You must be logged in to analyze meals.");
            }

            const token = await user.getIdToken(); // Get Firebase ID Token

            if (selectedImage) {
                const formData = new FormData();
                formData.append('file', selectedImage);

                // Start Python Backend: uvicorn main:app --reload --port 8000
                const response = await fetch('http://localhost:8000/analyze-meal/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || `Server error: ${response.status}`);
                }

                const data = await response.json();
                const advice = data.diasense_advice;

                // Map API response to UI State
                setPrediction({
                    type: 'ai',
                    summary: data.meal_summary,
                    totalCarbs: data.total_carbs_est,
                    riskLevel: advice.risk_level,
                    predictionText: advice.prediction,
                    bolusStrategy: advice.suggested_bolus_strategy,
                    components: data.components,
                    score: advice.risk_level?.toLowerCase().includes('high') ? 15 : advice.risk_level?.toLowerCase().includes('medium') ? 50 : 85,
                    isSaved: false
                });
            } else {
                // Mock analysis for manual selection
                setTimeout(() => {
                    setIsAnalyzing(false);
                    setPrediction({
                        type: 'manual',
                        item: selectedFood,
                        totalCarbs: selectedFood.carbs,
                        score: selectedFood.glycemicIndex === 'High' ? 15 : selectedFood.glycemicIndex === 'Medium' ? 35 : 85,
                        advice: selectedFood.glycemicIndex === 'High'
                            ? "Consider adding protein or fiber to blunt the spike."
                            : "Great choice! This should have a minimal impact on your glucose.",
                        isSaved: false
                    });
                }, 1500);
            }

        } catch (err) {
            console.error("Analysis failed:", err);
            setError(err.message || "Failed to analyze image. Ensure the backend is running.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveMeal = async () => {
        if (!prediction || !user) return;
        setIsSaving(true);
        try {
            // Unify structure for history
            const logData = prediction.type === 'ai' ? {
                meal_summary: prediction.summary,
                total_carbs_est: prediction.totalCarbs,
                components: prediction.components,
                diasense_advice: {
                    risk_level: prediction.riskLevel,
                    prediction: prediction.predictionText,
                    suggested_bolus_strategy: prediction.bolusStrategy
                }
            } : {
                meal_summary: prediction.item.name,
                totalCarbs: prediction.item.carbs,
                riskLevel: prediction.item.glycemicIndex,
                advice: prediction.advice
            };

            await logMeal(user.uid, logData);
            setSuccessMsg("Meal saved to your history!");
            // Update local state without fetching again
            setTodayTotals(prev => ({
                totalCarbs: prev.totalCarbs + prediction.totalCarbs,
                totalSugar: prev.totalSugar // (ignoring sugar computation here for simplicity)
            }));
            setPrediction(prev => ({...prev, isSaved: true}));
        } catch (err) {
            setError("Failed to save meal.");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredFoods = foodDatabase.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRiskColor = (level) => {
        const l = level?.toLowerCase() || '';
        if (l.includes('high')) return 'text-red-700 bg-red-50 border-red-200';
        if (l.includes('medium') || l.includes('moderate')) return 'text-orange-700 bg-orange-50 border-orange-200';
        return 'text-green-700 bg-green-50 border-green-200';
    };

    const getScoreColor = (score) => {
        if (score < 40) return 'text-red-600';
        if (score < 70) return 'text-orange-600';
        return 'text-green-600';
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">New Analysis</h2>
                <p className="text-slate-500">Log your meals and get AI-powered glucose predictions.</p>
            </div>

            <div className="max-w-2xl mx-auto flex flex-col gap-8">
                <Card className="w-full shadow-sm">
                    <CardHeader>
                        <CardTitle>Capture Meal</CardTitle>
                        <CardDescription>Upload a photo or search specifically.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Image Upload Area */}
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative min-h-[200px] flex flex-col justify-center items-center">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleImageUpload}
                            />
                            {previewUrl ? (
                                <div className="flex flex-col items-center w-full">
                                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-md mb-2 shadow-sm" />
                                    <p className="text-xs text-slate-500 font-medium bg-white/80 px-2 py-1 rounded absolute bottom-2">Click to change</p>
                                </div>
                            ) : (
                                <div className="space-y-2 pointer-events-none">
                                    <div className="mx-auto flex justify-center text-slate-400">
                                        <div className="bg-slate-100 p-3 rounded-full">
                                            <Utensils className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">Upload a food photo</p>
                                    <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                                </div>
                            )}
                        </div>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-100" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-400">Or search database</span>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for food (e.g. 'Rice')..."
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-9 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            {searchQuery && !selectedFood && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-100 rounded-md shadow-lg max-h-60 overflow-auto">
                                    {filteredFoods.length > 0 ? (
                                        filteredFoods.map(food => (
                                            <div
                                                key={food.id}
                                                className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm border-b last:border-0 border-slate-50"
                                                onClick={() => handleSelectFood(food)}
                                            >
                                                <span className="font-medium text-slate-700">{food.name}</span>
                                                <span className="ml-2 text-slate-400 text-xs">({food.carbs}g carbs)</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-slate-500">No foods found.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {(selectedFood || selectedImage) && (
                            <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full mt-2">
                                <span className="mr-2">Analyze Impact</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Analysis Result Panel */}
                <div className="space-y-4">
                    {!prediction && !isAnalyzing && (
                        <Card className="h-full flex items-center justify-center bg-slate-50 border-dashed">
                            <CardContent className="text-center p-8">
                                <Activity className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <h3 className="font-medium text-slate-900">Ready to Analyze</h3>
                                <p className="text-sm text-slate-500 mt-1">Upload an image or select a food to see detailed insights.</p>
                            </CardContent>
                        </Card>
                    )}

                    {prediction && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            
                            {/* Warnings based on limits */}
                            {prediction.totalCarbs + todayTotals.totalCarbs > userLimits.dailyCarbsLimit && (
                                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start gap-3 shadow-sm">
                                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
                                    <div>
                                        <h4 className="font-bold text-red-900">Daily Goal Exceeded!</h4>
                                        <p className="text-sm mt-1 text-red-700">
                                            This meal adds <b>{prediction.totalCarbs}g</b> of carbs, bringing your daily total up to <b>{prediction.totalCarbs + todayTotals.totalCarbs}g</b>. Your daily target is <b>{userLimits.dailyCarbsLimit}g</b>.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* AI Analysis Result */}
                            {prediction.type === 'ai' ? (
                                <>
                                    {/* Summary Card */}
                                    <div className="relative rounded-3xl overflow-hidden shadow-md bg-white border border-slate-200">
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white -z-10"></div>
                                        <div className="p-6 md:p-8 space-y-6">
                                            {/* Header Layer */}
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-slate-200/60 pb-6">
                                                <div className="flex-1">
                                                    <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm mb-3 border-0">
                                                        AI Analysis Complete
                                                    </Badge>
                                                    <p className="font-semibold text-lg text-slate-700 leading-relaxed">
                                                        {prediction.summary}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 min-w-[130px] text-center shrink-0">
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Metabolic Score</div>
                                                    <div className={`text-4xl font-extrabold tracking-tighter ${getScoreColor(prediction.score)}`}>
                                                        {prediction.score}<span className="text-xl text-slate-300">/100</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Key Metrics Widgets */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Total Carbs</div>
                                                    <div className="text-3xl font-black text-slate-900">{prediction.totalCarbs}<span className="text-[18px] font-bold text-slate-400 ml-1">g</span></div>
                                                </div>
                                                <div className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-center items-center text-center ${getRiskColor(prediction.riskLevel)}`}>
                                                    <div className="text-xs opacity-70 font-bold uppercase tracking-wider mb-2">Risk Level</div>
                                                    <div className="text-2xl font-black capitalize tracking-tight">{prediction.riskLevel}</div>
                                                </div>
                                            </div>

                                            {/* Insights */}
                                            <div className="space-y-4">
                                                <div className="bg-primary-50/40 rounded-2xl p-6 border border-primary-200/50 relative overflow-hidden">
                                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-200/40 rounded-full blur-2xl"></div>
                                                    <h4 className="font-bold text-primary-900 flex items-center gap-2 mb-3 relative z-10">
                                                        <Info className="h-5 w-5 text-primary-500" /> Clinical Insight
                                                    </h4>
                                                    <p className="text-primary-800 leading-relaxed relative z-10 font-medium text-[15px]">
                                                        {prediction.predictionText}
                                                    </p>
                                                </div>

                                                <div className="bg-[#eff6ff]/80 rounded-2xl p-6 border border-blue-100/50 shadow-sm">
                                                    <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
                                                        <Activity className="h-5 w-5 text-blue-500" /> Bolus Strategy
                                                    </h4>
                                                    <p className="text-blue-800 flex items-start leading-relaxed font-medium text-[15px]">
                                                        {prediction.bolusStrategy}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="pt-4">
                                                {!prediction.isSaved ? (
                                                    <Button onClick={handleSaveMeal} isLoading={isSaving} className="w-full h-14 text-base rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-md hover:shadow-lg transition-all border-0 text-white font-bold">
                                                        <Save className="mr-2 h-5 w-5" /> Save to History
                                                    </Button>
                                                ) : (
                                                    <div className="w-full h-14 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 shadow-inner">
                                                        <Check className="h-5 w-5" /> Saved Successfully
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Breakdown List */}
                                    <Card>
                                        <CardHeader className="pb-3 border-b border-slate-100">
                                            <CardTitle className="text-base font-semibold">Meal Breakdown</CardTitle>
                                        </CardHeader>
                                        <div className="divide-y divide-slate-100">
                                            {prediction.components.map((item, idx) => (
                                                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-slate-900">{item.name}</span>
                                                            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 font-normal bg-slate-100 text-slate-500">
                                                                {item.portion_est}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1">{item.impact}</p>
                                                    </div>
                                                    <div className="text-right pl-4">
                                                        <div className="font-bold text-slate-900">{item.carbs_g}g</div>
                                                        <div className={`text-xs font-semibold ${item.glycemic_index?.toLowerCase().includes('high') ? 'text-red-500' : item.glycemic_index?.toLowerCase().includes('medium') ? 'text-orange-500' : 'text-green-500'}`}>
                                                            {item.glycemic_index} GI
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </>
                            ) : (
                                /* Manual Prediction Fallback */
                                <Card className={`border-l-4 ${prediction.score > 50 ? 'border-l-green-500' : 'border-l-orange-500'}`}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-lg">{prediction.item.name}</h3>
                                            <Badge variant={prediction.score > 50 ? 'success' : 'warning'}>Manual Entry</Badge>
                                        </div>
                                        <p className="text-slate-600 mb-4">{prediction.advice}</p>
                                        <div className="flex items-center justify-between text-sm text-slate-500 border-t pt-4">
                                            <span>Est. Carbs: {prediction.item.carbs}g</span>
                                            <span>Glycemic Index: {prediction.item.glycemicIndex}</span>
                                        </div>
                                        {!prediction.isSaved ? (
                                            <Button onClick={handleSaveMeal} isLoading={isSaving} className="w-full mt-4" variant="outline">
                                                <Save className="mr-2 h-4 w-4" /> Save to History
                                            </Button>
                                        ) : (
                                            <div className="p-3 bg-green-50 text-green-700 rounded-md border border-green-200 flex items-center justify-center font-medium mt-4">
                                                <Check className="mr-2 h-4 w-4" /> Saved Successfully
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="fixed bottom-4 right-4 bg-red-white border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-xl animate-in slide-in-from-bottom-2 z-50 flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-600 font-bold">&times;</button>
                </div>
            )}
            
            {successMsg && (
                <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3">
                    <Check className="h-5 w-5" />
                    <span>{successMsg}</span>
                    <button onClick={() => setSuccessMsg(null)} className="ml-4 text-green-600 hover:text-green-800 font-bold">&times;</button>
                </div>
            )}

            <SafeFoodsList />
        </div>
    );
}
