"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, MapPin, Trash2, Star, Edit3, Loader2, X, Navigation } from "lucide-react";
import Link from "next/link";
import { GoogleMap, MarkerF, Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"];

interface Address {
    _id: string;
    label: string;
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    area?: string;
    city: string;
    state: string;
    pincode: string;
    lat?: number;
    lng?: number;
    isDefault: boolean;
}

const EMPTY: Omit<Address, "_id"> = {
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
};

export default function AddressesPage() {
    const { user, loading: authLoading } = useUser();
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [locating, setLocating] = useState(false);

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: GOOGLE_MAPS_LIBRARIES,
    });

    const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
    const [autocompleteInfo, setAutocompleteInfo] = useState<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (!authLoading && !user) { router.push("/user/login"); return; }
        if (user) fetchAddresses();
    }, [user, authLoading, router]);

    async function fetchAddresses() {
        const res = await fetch("/api/user/addresses");
        const data = await res.json();
        setAddresses(data.addresses || []);
        setLoading(false);
    }

    function openNew() {
        setForm({ ...EMPTY, phone: user?.phone || "", fullName: user?.name || "" });
        setEditId(null);
        setShowForm(true);
        if (navigator.geolocation && !locating) {
            navigator.geolocation.getCurrentPosition(pos => {
                setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            }, () => { }, { timeout: 3000 });
        }
    }

    function openEdit(addr: Address) {
        setForm({
            label: addr.label,
            fullName: addr.fullName,
            phone: addr.phone,
            line1: addr.line1,
            line2: addr.line2 || "",
            area: addr.area || "",
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            isDefault: addr.isDefault,
            lat: addr.lat,
            lng: addr.lng,
        });
        setEditId(addr._id);
        setShowForm(true);
        if (addr.lat && addr.lng) {
            setMapCenter({ lat: addr.lat, lng: addr.lng });
        }
    }

    async function handleSave() {
        if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) return;
        setSaving(true);

        if (editId) {
            await fetch("/api/user/addresses", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ addressId: editId, ...form }),
            });
        } else {
            await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
        }

        await fetchAddresses();
        setShowForm(false);
        setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this address?")) return;
        await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" });
        await fetchAddresses();
    }

    const reverseGeocodeAndFillForm = (lat: number, lng: number) => {
        if (!window.google) return;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
                const ac = results[0].address_components;
                let pincode = "", city = "", area = "", state = "", line1 = "";

                for (let comp of ac) {
                    if (comp.types.includes("postal_code")) pincode = comp.long_name;
                    if (comp.types.includes("locality")) city = comp.long_name;
                    else if (comp.types.includes("administrative_area_level_3") && !city) city = comp.long_name;
                    if (comp.types.includes("sublocality") || comp.types.includes("neighborhood")) area = comp.long_name;
                    if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
                }

                line1 = results[0].formatted_address.split(",").slice(0, 2).join(",");

                setForm(prev => ({
                    ...prev, lat, lng,
                    pincode: pincode || prev.pincode,
                    city: city || prev.city,
                    area: area || prev.area,
                    state: state || prev.state,
                    line1: line1 || prev.line1,
                }));
            }
        });
    };

    const handlePlaceChanged = () => {
        if (autocompleteInfo !== null) {
            const place = autocompleteInfo.getPlace();
            if (place.geometry?.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setMapCenter({ lat, lng });
                reverseGeocodeAndFillForm(lat, lng);
            }
        }
    };

    async function handleLiveLocation() {
        if (!navigator.geolocation) return alert("Location not supported");
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setMapCenter({ lat, lng });
                reverseGeocodeAndFillForm(lat, lng);
                setLocating(false);
            },
            () => {
                alert("Location permission denied");
                setLocating(false);
            }
        );
    }

    if (authLoading || loading) {
        return <div className="flex min-h-[60dvh] items-center justify-center"><Loader2 className="size-8 animate-spin text-saffron-500" /></div>;
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/user/profile" className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm border border-warm-100">
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-lg font-semibold text-warm-900">Saved Addresses</h1>
                </div>
                <Button size="sm" onClick={openNew} className="rounded-lg bg-saffron-600 text-xs">
                    <Plus size={14} className="mr-1" /> Add
                </Button>
            </div>

            {/* Address List */}
            {addresses.length === 0 && !showForm ? (
                <div className="py-16 text-center">
                    <MapPin className="mx-auto mb-3 text-warm-300" size={40} />
                    <p className="text-sm text-warm-500">No saved addresses</p>
                    <Button onClick={openNew} variant="outline" className="mt-4 rounded-lg">Add Address</Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {addresses.map((addr) => (
                        <div key={addr._id} className="rounded-2xl border border-gold-200/50 bg-white p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="rounded-lg bg-saffron-50 px-2.5 py-1 text-xs font-semibold text-saffron-700">
                                        {addr.label}
                                    </span>
                                    {addr.isDefault && (
                                        <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                                            <Star size={10} /> Default
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openEdit(addr)} className="rounded-lg p-1.5 text-warm-400 hover:bg-warm-50">
                                        <Edit3 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(addr._id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-2 text-sm font-medium text-warm-900">{addr.fullName}</p>
                            <p className="mt-1 text-xs text-warm-600">
                                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                                {addr.area ? `, ${addr.area}` : ""}
                            </p>
                            <p className="text-xs text-warm-500">
                                {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="mt-1 text-xs text-warm-400">{addr.phone}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ═══════ ADD/EDIT FORM ═══════ */}
            {showForm && (
                <div className="fixed inset-0 z-[80] flex items-end bg-black/40 backdrop-blur-sm md:items-center md:justify-center">
                    <div className="max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl bg-[#fffdf7] p-5 shadow-2xl md:max-w-lg md:rounded-3xl">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-warm-900">{editId ? "Edit" : "Add"} Address</h2>
                            <button onClick={() => setShowForm(false)} className="flex size-8 items-center justify-center rounded-full bg-warm-100">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Map Picker & Live Location */}
                        {isLoaded && (
                            <div className="mb-4">
                                <Label className="text-xs mb-1.5 block">Search on Map</Label>
                                <Autocomplete onLoad={setAutocompleteInfo} onPlaceChanged={handlePlaceChanged}>
                                    <Input placeholder="Search your area, building..." className="bg-white mb-2" />
                                </Autocomplete>
                                <div className="h-40 w-full rounded-xl overflow-hidden relative border border-warm-200">
                                    <GoogleMap
                                        mapContainerStyle={{ width: "100%", height: "100%" }}
                                        center={mapCenter}
                                        zoom={15}
                                        onClick={(e) => {
                                            if (e.latLng) {
                                                const lat = e.latLng.lat();
                                                const lng = e.latLng.lng();
                                                setMapCenter({ lat, lng });
                                                reverseGeocodeAndFillForm(lat, lng);
                                            }
                                        }}
                                        options={{ disableDefaultUI: true, zoomControl: true }}
                                    >
                                        <MarkerF
                                            position={mapCenter}
                                            draggable
                                            onDragEnd={(e) => {
                                                if (e.latLng) {
                                                    const lat = e.latLng.lat();
                                                    const lng = e.latLng.lng();
                                                    setMapCenter({ lat, lng });
                                                    reverseGeocodeAndFillForm(lat, lng);
                                                }
                                            }}
                                        />
                                    </GoogleMap>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleLiveLocation}
                            disabled={locating}
                            className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-saffron-300 bg-saffron-50/50 px-4 py-3 text-sm font-medium text-saffron-700 transition active:scale-[0.98]"
                        >
                            {locating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                            {locating ? "Getting location..." : "Use Current Location"}
                        </button>

                        {/* Label */}
                        <div className="flex gap-2 mb-4">
                            {["Home", "Office", "Other"].map((l) => (
                                <button key={l}
                                    onClick={() => setForm({ ...form, label: l })}
                                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${form.label === l
                                        ? "bg-saffron-600 text-white"
                                        : "bg-warm-100 text-warm-600"
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1"><Label className="text-xs">Full Name *</Label>
                                    <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                                </div>
                                <div className="space-y-1"><Label className="text-xs">Phone *</Label>
                                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1"><Label className="text-xs">Address Line 1 *</Label>
                                <Input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="House no, Building" />
                            </div>
                            <div className="space-y-1"><Label className="text-xs">Address Line 2</Label>
                                <Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} placeholder="Street, Colony" />
                            </div>
                            <div className="space-y-1"><Label className="text-xs">Area / Locality</Label>
                                <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Locality" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1"><Label className="text-xs">City *</Label>
                                    <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                                </div>
                                <div className="space-y-1"><Label className="text-xs">Pincode *</Label>
                                    <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} maxLength={6} />
                                </div>
                            </div>
                            <div className="space-y-1"><Label className="text-xs">State *</Label>
                                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                                    className="size-4 rounded border-warm-300 text-saffron-600" />
                                <span className="text-xs text-warm-700">Set as default address</span>
                            </label>
                        </div>

                        <Button onClick={handleSave} disabled={saving} className="mt-5 w-full rounded-xl bg-saffron-600 py-6 text-base font-semibold">
                            {saving ? <Loader2 className="animate-spin" /> : editId ? "Update Address" : "Save Address"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
