// Mock Data Service

export const userData = {
    name: "salaheddine manaa",
    type: "Type 1 Diabetes",
    sensitivity: "1:15",
    targetRange: [70, 180],
};

// Generate realistic glucose data for the last 24 hours
export const generateGlucoseData = () => {
    const data = [];
    const now = new Date();
    let value = 110;

    for (let i = 0; i < 288; i++) { // 24 hours * 12 readings/hour (every 5 mins) is too much for chart, let's do every 15 mins = 96 points
        const time = new Date(now.getTime() - (96 - i) * 15 * 60000);

        // Random walk with trend
        const change = (Math.random() - 0.5) * 10;
        value += change;

        // Keep within physiological bounds (40-400)
        value = Math.max(50, Math.min(350, value));

        // Add some "spikes" around meal times (simulated)
        const hour = time.getHours();
        if ((hour === 8 || hour === 13 || hour === 19) && time.getMinutes() < 30) {
            value += Math.random() * 5;
        }

        data.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: Math.round(value),
        });
    }
    return data;
};

export const metrics = {
    avgGlucose: 124,
    timeInRange: "85%",
    steps: 8432,
    stress: "Low",
    insulinOnBoard: 1.2,
};

export const recentMeals = [
    { id: 1, name: "Oatmeal with Berries", carbs: 45, time: "08:30 AM", impact: "Low" },
    { id: 2, name: "Grilled Chicken Salad", carbs: 12, time: "12:45 PM", impact: "Stable" },
    { id: 3, name: "Apple", carbs: 15, time: "03:00 PM", impact: "Low" },
];

export const foodDatabase = [
    { id: 1, name: "White Rice (1 cup)", carbs: 45, glycemicIndex: "High", prediction: "Spike Likely" },
    { id: 2, name: "Brown Rice (1 cup)", carbs: 42, glycemicIndex: "Medium", prediction: "Moderate Rise" },
    { id: 3, name: "Quinoa (1 cup)", carbs: 39, glycemicIndex: "Low", prediction: "Stable Response" },
    { id: 4, name: "Lentil Soup", carbs: 20, glycemicIndex: "Low", prediction: "Recommended" },
    { id: 5, name: "Pizza Slice", carbs: 35, glycemicIndex: "High", prediction: "Delayed Spike" },
];

// --- Insights: weekly stats and user summary ---
export const insightStats = {
    period: "This week",
    avgGlucose: 124,
    avgGlucoseLastWeek: 131,
    timeInRange: 85,
    timeInRangeLastWeek: 78,
    totalSpikes: 11,
    totalLows: 2,
    readingsLogged: 96,
    bestDay: "Friday",
    worstDay: "Wednesday",
    trend: "improving", // improving | stable | worsening
    streakDaysInRange: 3,
};

export const weeklyGlucoseData = [
    { day: "Mon", short: "M", spikes: 2, avg: 118, timeInRange: 88, readings: 14 },
    { day: "Tue", short: "T", spikes: 1, avg: 115, timeInRange: 92, readings: 14 },
    { day: "Wed", short: "W", spikes: 4, avg: 145, timeInRange: 72, readings: 14 },
    { day: "Thu", short: "T", spikes: 1, avg: 118, timeInRange: 86, readings: 14 },
    { day: "Fri", short: "F", spikes: 0, avg: 110, timeInRange: 96, readings: 14 },
    { day: "Sat", short: "S", spikes: 2, avg: 125, timeInRange: 82, readings: 14 },
    { day: "Sun", short: "S", spikes: 1, avg: 112, timeInRange: 90, readings: 12 },
];

export const aiInsightSummary = {
    weekly: "Your glucose stability has improved by 15% compared to last week. The spike on Wednesday correlates with high stress levels recorded.",
    recommendation: "Keep up the good work with breakfast! Your post-meal readings are consistently in range when you eat oatmeal.",
    highlight: "You had zero spikes on Friday — your best day this week.",
};
