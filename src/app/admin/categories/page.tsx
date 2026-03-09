"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Target, Sparkles } from "lucide-react";

const MAIN_CATEGORIES = [
    "Bracelets", "Rudraksha", "Gemstones", "Vastu", "Pyramids", "Siddh Collection",
    "Combos", "Karungali", "Pyrite", "Jewellery", "Gifting",
];

const PURPOSES = [
    { value: "wealth", label: "💰 Wealth" },
    { value: "love", label: "❤️ Love" },
    { value: "protection", label: "🛡 Protection" },
    { value: "health", label: "🩺 Health" },
    { value: "career", label: "📈 Career" },
    { value: "rashi", label: "♈ Rashi" },
];

const ZODIACS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export default function CategoriesPage() {
    const [activeCategories, setActiveCategories] = useState<string[]>(MAIN_CATEGORIES);
    const [activePurposes, setActivePurposes] = useState<string[]>(PURPOSES.map((p) => p.value));
    const [activeZodiacs, setActiveZodiacs] = useState<string[]>(ZODIACS.map((z) => z.toLowerCase()));

    const toggleItem = (list: string[], item: string, setter: (v: string[]) => void) => {
        setter(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Category Master</h1>
                <p className="text-sm text-gray-500 mt-1">Manage all categories, purposes, and zodiac mappings from here</p>
            </div>

            {/* Main Categories */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Layers size={18} /> Main Categories</CardTitle>
                    <p className="text-sm text-gray-500">Enable/disable categories that appear in the store</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {MAIN_CATEGORIES.map((cat) => (
                            <label
                                key={cat}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${activeCategories.includes(cat)
                                        ? "bg-saffron-50 border-saffron-300 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={activeCategories.includes(cat)}
                                    onChange={() => toggleItem(activeCategories, cat, setActiveCategories)}
                                    className="h-4 w-4 rounded border-gray-300 text-saffron-600 focus:ring-saffron-500"
                                />
                                <span className="text-sm font-medium text-gray-900">{cat}</span>
                            </label>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Shop By Purpose */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Target size={18} /> Shop By Purpose</CardTitle>
                    <p className="text-sm text-gray-500">Purpose tags available for product mapping</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {PURPOSES.map((purpose) => (
                            <label
                                key={purpose.value}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${activePurposes.includes(purpose.value)
                                        ? "bg-blue-50 border-blue-300 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={activePurposes.includes(purpose.value)}
                                    onChange={() => toggleItem(activePurposes, purpose.value, setActivePurposes)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-900">{purpose.label}</span>
                            </label>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Zodiac Mapping */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles size={18} /> Zodiac Mapping</CardTitle>
                    <p className="text-sm text-gray-500">Zodiac signs available for product compatibility mapping</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {ZODIACS.map((zodiac) => (
                            <label
                                key={zodiac}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-center ${activeZodiacs.includes(zodiac.toLowerCase())
                                        ? "bg-purple-50 border-purple-300 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={activeZodiacs.includes(zodiac.toLowerCase())}
                                    onChange={() => toggleItem(activeZodiacs, zodiac.toLowerCase(), setActiveZodiacs)}
                                    className="h-3.5 w-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-xs font-medium text-gray-900">{zodiac}</span>
                            </label>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
