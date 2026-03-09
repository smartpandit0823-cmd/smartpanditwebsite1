"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/admin/forms/FileUpload";
import { Gift, Plus, Trash2, IndianRupee, Search } from "lucide-react";

interface ComboProduct {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface ComboFormData {
    name: string;
    products: ComboProduct[];
    comboPrice: number;
    bannerImage: string;
    isActive: boolean;
}

// Demo products for selection
const AVAILABLE_PRODUCTS: ComboProduct[] = [
    { id: "1", name: "5 Mukhi Rudraksha", price: 999, image: "" },
    { id: "2", name: "Citrine Bracelet", price: 1299, image: "" },
    { id: "3", name: "Kuber Yantra", price: 599, image: "" },
    { id: "4", name: "Hanuman Kavach", price: 799, image: "" },
    { id: "5", name: "Sphatik Mala", price: 1499, image: "" },
    { id: "6", name: "Pyrite Bracelet", price: 899, image: "" },
];

export default function CombosPage() {
    const [combos, setCombos] = useState<ComboFormData[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<ComboFormData>({
        name: "",
        products: [],
        comboPrice: 0,
        bannerImage: "",
        isActive: true,
    });
    const [search, setSearch] = useState("");

    const totalOriginal = form.products.reduce((sum, p) => sum + p.price, 0);
    const savings = totalOriginal - form.comboPrice;

    const filteredProducts = AVAILABLE_PRODUCTS.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            !form.products.find((fp) => fp.id === p.id)
    );

    const addProduct = (product: ComboProduct) => {
        setForm({ ...form, products: [...form.products, product] });
    };

    const removeProduct = (id: string) => {
        setForm({ ...form, products: form.products.filter((p) => p.id !== id) });
    };

    const saveCombo = () => {
        if (!form.name || form.products.length < 2) return;
        setCombos([...combos, form]);
        setForm({ name: "", products: [], comboPrice: 0, bannerImage: "", isActive: true });
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Combo Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Create and manage product combos for higher AOV</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="bg-saffron-600 hover:bg-saffron-700 gap-2">
                    <Plus size={16} /> Create Combo
                </Button>
            </div>

            {/* Create Combo Form */}
            {showForm && (
                <Card className="border-saffron-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gift size={18} /> New Combo Deal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Combo Name *</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Wealth & Prosperity Kit"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Combo Price (₹) *</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={form.comboPrice}
                                    onChange={(e) => setForm({ ...form, comboPrice: Number(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        {/* Product Selector */}
                        <div className="space-y-3">
                            <Label>Select Products</Label>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search products..."
                                    className="pl-9"
                                />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                                {filteredProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onClick={() => addProduct(product)}
                                        className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 hover:border-saffron-300 hover:bg-saffron-50/50 transition text-left"
                                    >
                                        <div className="w-8 h-8 bg-gray-100 rounded-md shrink-0 flex items-center justify-center text-xs">📦</div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                                            <p className="text-[10px] text-gray-500">₹{product.price}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selected Products */}
                        {form.products.length > 0 && (
                            <div className="space-y-2">
                                <Label>Selected Products ({form.products.length})</Label>
                                <div className="space-y-2">
                                    {form.products.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{product.name}</span>
                                                <span className="text-xs text-gray-500">₹{product.price}</span>
                                            </div>
                                            <button type="button" onClick={() => removeProduct(product.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price Summary */}
                        {form.products.length >= 2 && form.comboPrice > 0 && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Original Total:</span>
                                    <span className="line-through text-gray-400">₹{totalOriginal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Combo Price:</span>
                                    <span className="font-bold text-gray-900">₹{form.comboPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t border-emerald-200">
                                    <span className="font-bold text-emerald-700">Customer Saves:</span>
                                    <span className="font-bold text-emerald-700">₹{savings.toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {/* Banner Upload */}
                        <div className="space-y-2">
                            <Label>Combo Banner Image</Label>
                            <FileUpload
                                value={form.bannerImage}
                                onChange={(v) => setForm({ ...form, bannerImage: v as string })}
                                folder="combos"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={saveCombo} disabled={!form.name || form.products.length < 2} className="bg-saffron-600 hover:bg-saffron-700">
                                Save Combo
                            </Button>
                            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Existing Combos */}
            {combos.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {combos.map((combo, i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-900">{combo.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${combo.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                        {combo.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{combo.products.length} items · ₹{combo.comboPrice}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : !showForm && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Gift size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Combos Yet</h3>
                        <p className="text-sm text-gray-400 mb-4">Create your first combo deal to boost Average Order Value</p>
                        <Button onClick={() => setShowForm(true)} className="bg-saffron-600 hover:bg-saffron-700 gap-2">
                            <Plus size={16} /> Create First Combo
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
