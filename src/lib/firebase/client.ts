import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAGTAtvoq0Gm7XT0xkpw9UQ-88Bb49cGZc",
    authDomain: "sanatansetuweb.firebaseapp.com",
    projectId: "sanatansetuweb",
    storageBucket: "sanatansetuweb.firebasestorage.app",
    messagingSenderId: "778196549112",
    appId: "1:778196549112:web:7d10fa38b3d79cfeeaea0d",
    measurementId: "G-5GJEDV3R1F"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const authClient = getAuth(app);

// Firebase docs: localhost is NOT allowed for phone auth.
// For development/testing, disable app verification.
// This MUST be removed or set to false in production!
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    authClient.settings.appVerificationDisabledForTesting = true;
}
