/* =============================================
   FILE: src/scripts/seed.ts
   IMPROVED SEED SCRIPT
   ============================================= */

import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const seedData = async () => {
  console.log("🌱 Starting seed process...");

  try {
    // === SEED FOODS ===
    const foods = [
      { name: "Injera Be Wot", price: 185, category: "Lunch", fasting: "NON_FASTING", available: true, description: "Spicy beef stew with injera" },
      { name: "Shiro", price: 120, category: "Lunch", fasting: "FASTING", available: true, description: "Chickpea stew" },
      { name: "Doro Wot", price: 220, category: "Dinner", fasting: "NON_FASTING", available: true, description: "Traditional chicken stew" },
      { name: "Avocado Toast", price: 110, category: "Breakfast", fasting: "BOTH", available: true, description: "Smashed avocado on toast" },
    ];

    console.log("Adding foods...");
    for (const food of foods) {
      await addDoc(collection(db, 'foods'), {
        ...food,
        createdAt: serverTimestamp()
      });
    }

    // === SEED TABLES ===
    console.log("Adding tables...");
    for (let i = 1; i <= 15; i++) {
      await addDoc(collection(db, 'tables'), {
        number: i.toString().padStart(2, '0'),
        status: (i % 3 === 0) ? "Occupied" : "Available",
        guests: (i % 3 === 0) ? Math.floor(Math.random() * 5) + 2 : 0,
        createdAt: serverTimestamp()
      });
    }

    console.log("🎉 Seed completed successfully!");
    alert("✅ Seed data added!\n\nCollections created:\n• foods\n• tables\n\nRefresh Firestore Console.");

  } catch (error: any) {
    console.error("❌ Seed failed:", error);
    alert("Seed failed. Check console for details.\n\nError: " + error.message);
  }
};

export default seedData;