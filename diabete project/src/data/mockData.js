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
