import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Creates or updates a user profile in Firestore
 * @param {string} uid - The Firebase Auth User ID
 * @param {Object} data - The user data (name, email, diabetesType, etc.)
 */
export const createUserProfile = async (uid, data) => {
    try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
            ...data,
            createdAt: new Date().toISOString()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

/**
 * Retrieves a user profile from Firestore
 * @param {string} uid - The Firebase Auth User ID
 * @returns {Object|null} The user data or null if not found
 */
export const getUserProfile = async (uid) => {
    try {
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such user profile!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
};
