import { Leaf, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const safeFoods = [
    { name: 'Lentils', reason: 'Low glycemic impact for your profile', impact: 'Low' },
    { name: 'Greek Yogurt', reason: 'High protein blunts spikes', impact: 'Steady' },
    { name: 'Berries', reason: 'Antioxidants & fiber', impact: 'Low' },
    { name: 'Quinoa', reason: 'Complex carbs digest slowly', impact: 'Moderate' },
];

export default function SafeFoodsList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    Recommended "Safe" Foods
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {safeFoods.map((food, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">{food.name}</h4>
                                <p className="text-xs text-slate-500 mt-1">{food.reason}</p>
                            </div>
                            <div className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                {food.impact}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
