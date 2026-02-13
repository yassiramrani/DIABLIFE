import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Activity, Brain, Utensils, Smartphone } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col min-h-[80vh] items-center justify-center space-y-12 py-8">

            {/* Hero Section */}
            <section className="text-center space-y-6 max-w-3xl mx-auto px-4">
                <div className="inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600 mb-4">
                    <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2"></span>
                    AI-Powered Diabetes Management
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                    Personalized Glycemic <span className="text-primary-500">Response</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                    Take control of your diabetes with real-time monitoring, AI-driven nutrition insights, and personalized prediction models.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link to="/dashboard">
                        <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-2xl">
                            Start Tracking
                        </Button>
                    </Link>
                    <Link to="/dashboard">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-2xl">
                            View Demo Dashboard
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4">
                <FeatureCard
                    icon={Activity}
                    title="Real-Time Monitoring"
                    description="Connect your CGM for live glucose tracking and instant spike alerts."
                />
                <FeatureCard
                    icon={Brain}
                    title="AI Predictions"
                    description="Our metabolic model predicts how your body reacts to different foods."
                />
                <FeatureCard
                    icon={Utensils}
                    title="Smart Food Log"
                    description="Log meals and get personalized scores based on your biology."
                />
                <FeatureCard
                    icon={Smartphone}
                    title="Mobile First"
                    description="Designed for your life, working perfectly on phone and desktop."
                />
            </section>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <Card className="border-0 shadow-none bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary-500">
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500">{description}</p>
            </CardContent>
        </Card>
    )
}
