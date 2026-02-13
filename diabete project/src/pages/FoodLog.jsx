import { useState } from 'react';
import { Search, ArrowRight, Check, AlertTriangle, Info, Utensils, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import SafeFoodsList from '../components/SafeFoodsList';
import { foodDatabase } from '../data/mockData';

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

export default function FoodLog() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSelectedFood(null);
        setSelectedImage(null);
        setPreviewUrl(null);
        setPrediction(null);
        setError(null);
    };

    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setSearchQuery(food.name);
        setPrediction(null);
        setError(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setSelectedFood(null); // Clear manual selection if image is uploaded
            setPrediction(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFood && !selectedImage) return;
        setIsAnalyzing(true);
        setError(null);
        setPrediction(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("You must be logged in to analyze meals.");
            }

            if (selectedImage) {
                const formData = new FormData();
                formData.append('file', selectedImage);

                const response = await fetch('http://localhost:8000/analyze-meal/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                const advice = data.diasense_advice;

                setPrediction({
                    type: 'ai',
                    summary: data.meal_summary,
                    totalCarbs: data.total_carbs_est,
                    riskLevel: advice.risk_level,
                    predictionText: advice.prediction,
                    bolusStrategy: advice.suggested_bolus_strategy,
                    components: data.components,
                    score: advice.risk_level?.toLowerCase().includes('high') ? 15 : advice.risk_level?.toLowerCase().includes('medium') ? 50 : 85,
                });
            } else {
                // Mock analysis for manual selection
                setTimeout(() => {
                    setIsAnalyzing(false);
                    setPrediction({
                        type: 'manual',
                        item: selectedFood,
                        score: selectedFood.glycemicIndex === 'High' ? 15 : selectedFood.glycemicIndex === 'Medium' ? 35 : 85,
                        advice: selectedFood.glycemicIndex === 'High'
                            ? "Consider adding protein or fiber to blunt the spike."
                            : "Great choice! This should have a minimal impact on your glucose."
                    });
                }, 1500);
            }

        } catch (err) {
            console.error("Analysis failed:", err);
            setError("Failed to analyze image. Ensure the backend is running.");
        } finally {
            setIsAnalyzing(false);
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
        <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Food Logger</h2>
                <p className="text-slate-500">Log your meals and get AI-powered glucose predictions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="h-full">
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
                            {/* AI Analysis Result */}
                            {prediction.type === 'ai' ? (
                                <>
                                    {/* Summary Card */}
                                    <Card className="border-l-4 border-l-primary-500 overflow-hidden">
                                        <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-primary-900">{prediction.summary}</h3>
                                                    <Badge variant="outline" className="mt-1 bg-white text-primary-700 border-primary-200">
                                                        AI Confidence High
                                                    </Badge>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-primary-600 font-semibold uppercase tracking-wider">Metabolic Score</div>
                                                    <div className={`text-2xl font-bold ${getScoreColor(prediction.score)}`}>{prediction.score}/100</div>
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-6 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    <div className="text-xs text-slate-500 uppercase font-bold">Total Carbs</div>
                                                    <div className="text-xl font-bold text-slate-900">{prediction.totalCarbs}g</div>
                                                </div>
                                                <div className={`p-3 rounded-lg border ${getRiskColor(prediction.riskLevel)}`}>
                                                    <div className="text-xs opacity-75 uppercase font-bold">Risk Level</div>
                                                    <div className="text-xl font-bold">{prediction.riskLevel}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm text-slate-700 flex items-center">
                                                    <Info className="h-4 w-4 mr-1.5 text-primary-500" />
                                                    Clinical Insight
                                                </h4>
                                                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100 italic">
                                                    "{prediction.predictionText}"
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm text-slate-700">Bolus Strategy</h4>
                                                <div className="text-sm text-slate-800 font-medium bg-blue-50 text-blue-800 p-3 rounded-md border border-blue-100">
                                                    {prediction.bolusStrategy}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

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

            <SafeFoodsList />
        </div>
    );
}
