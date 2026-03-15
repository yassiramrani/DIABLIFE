import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Logs a new meal to the user's history
 * @param {string} uid - Firebase Auth User ID
 * @param {Object} mealData - The meal analysis data
 */
export const logMeal = async (uid, mealData) => {
    try {
        const logsRef = collection(db, "users", uid, "foodLogs");
        const docRef = await addDoc(logsRef, {
            ...mealData,
            createdAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error logging meal:", error);
        throw error;
    }
};

/**
 * Retrieves food logs for a given user within a date range (default today)
 * @param {string} uid - Firebase Auth User ID
 * @param {number} limitDays - Number of days to look back
 */
export const getFoodLogs = async (uid, limitDays = 1) => {
    try {
        const logsRef = collection(db, "users", uid, "foodLogs");
        
        // Calculate start date
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (limitDays - 1));
        startDate.setHours(0, 0, 0, 0);

        const q = query(
            logsRef,
            where("createdAt", ">=", Timestamp.fromDate(startDate)),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const logs = [];
        querySnapshot.forEach((doc) => {
            logs.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            });
        });
        return logs;
    } catch (error) {
        console.error("Error getting food logs:", error);
        return [];
    }
};

/**
 * Calculates total carbs and sugar for today
 * @param {string} uid - Firebase Auth User ID
 */
export const getTodayTotals = async (uid) => {
    try {
        const logs = await getFoodLogs(uid, 1);
        let totalCarbs = 0;
        let totalSugar = 0;

        logs.forEach(log => {
            // Accommodate different potential formats from our AI backend
            totalCarbs += Number(log.totalCarbs || log.total_carbs_est || 0);
            
            // Try to extract sugar if it exists in components, otherwise just keep it 0 or add a mock ratio
            if (log.components && Array.isArray(log.components)) {
                log.components.forEach(comp => {
                    // Rough estimation if sugar isn't directly provided by current prompt:
                    // Just as a placeholder feature until AI prompt adds pure sugar
                    if (comp.name.toLowerCase().includes('sugar') || comp.name.toLowerCase().includes('sweet')) {
                         totalSugar += (comp.carbs_g || 0);
                    }
                });
            }
        });

        return { totalCarbs, totalSugar, logsCount: logs.length, logs };
    } catch (error) {
        console.error("Error calculating today's totals:", error);
        return { totalCarbs: 0, totalSugar: 0, logsCount: 0, logs: [] };
    }
};
