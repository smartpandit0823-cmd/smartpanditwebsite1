"use client";

import { useState, useEffect, useRef } from "react";
import {
    UserPlus, CheckCircle2, MapPin, Upload, Star, Send, Loader2,
    X, Camera, FileText, Plus, Trash2
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SPECIALIZATIONS = [
    "Griha Pravesh", "Satyanarayan Katha", "Rudrabhishek", "Navgraha Shanti",
    "Vivah (Marriage)", "Mundan", "Naamkaran", "Vastu Shanti",
    "Sunderkand Path", "Laxmi Puja", "Ganesh Puja", "Durga Puja",
    "Mahamrityunjay Jaap", "Kaal Sarp Dosh", "Mangal Dosh",
    "Kundli Reading", "Horoscope", "Vedic Astrology", "Vastu Consultation",
];

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh",
];

// ── File Upload Helper ──
async function uploadFile(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/upload/pandit", { method: "POST", body: formData });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Upload failed");
    return json.url;
}

function JoinPanditFormContent() {
    const searchParams = useSearchParams();
    const isAstrologer = searchParams.get("type") === "astrologer";
    const photoInputRef = useRef<HTMLInputElement>(null);
    const certInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        lat: 0,
        lng: 0,
        experience: "",
        specializations: [] as string[],
        providesAstrology: isAstrologer,
        photo: "",
        certifications: [] as string[],
    });

    // Local file state
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState("");
    const [certFiles, setCertFiles] = useState<{ file: File; name: string; preview?: string }[]>([]);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingCert, setUploadingCert] = useState(false);

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [detectingLocation, setDetectingLocation] = useState(false);

    useEffect(() => {
        if (isAstrologer) setForm(f => ({ ...f, providesAstrology: true }));
    }, [isAstrologer]);

    function updateField(field: string, value: any) {
        setForm(f => ({ ...f, [field]: value }));
    }

    function toggleSpecialization(spec: string) {
        setForm(f => ({
            ...f,
            specializations: f.specializations.includes(spec)
                ? f.specializations.filter(s => s !== spec)
                : [...f.specializations, spec],
        }));
    }

    // ── Photo Handling ──
    function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { alert("Photo must be under 5MB"); return; }
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    }

    function removePhoto() {
        setPhotoFile(null);
        setPhotoPreview("");
        updateField("photo", "");
        if (photoInputRef.current) photoInputRef.current.value = "";
    }

    // ── Certificate Handling ──
    function handleCertSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;
        const newCerts = Array.from(files).map(file => ({
            file,
            name: file.name,
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        }));
        setCertFiles(prev => [...prev, ...newCerts]);
        if (certInputRef.current) certInputRef.current.value = "";
    }

    function removeCert(idx: number) {
        setCertFiles(prev => prev.filter((_, i) => i !== idx));
    }

    // ── Location Detection ──
    async function detectLocation() {
        if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await res.json();
                    if (data.address) {
                        const addr = data.address;
                        setForm(f => ({
                            ...f,
                            lat: latitude,
                            lng: longitude,
                            address: data.display_name || "",
                            city: addr.city || addr.town || addr.village || addr.county || f.city,
                            state: addr.state || f.state,
                            pincode: addr.postcode || f.pincode,
                        }));
                    } else {
                        setForm(f => ({ ...f, lat: latitude, lng: longitude }));
                    }
                } catch {
                    setForm(f => ({ ...f, lat: latitude, lng: longitude }));
                }
                setDetectingLocation(false);
            },
            () => { alert("Unable to detect location. Please enter manually."); setDetectingLocation(false); },
            { enableHighAccuracy: true }
        );
    }

    // ── Submit ──
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Upload photo
            let photoUrl = form.photo;
            if (photoFile) {
                setUploadingPhoto(true);
                photoUrl = await uploadFile(photoFile, "pandits");
                setUploadingPhoto(false);
            }

            // 2. Upload certificates
            setUploadingCert(true);
            const certUrls: string[] = [...form.certifications];
            for (const cert of certFiles) {
                const url = await uploadFile(cert.file, "pandits/certs");
                certUrls.push(url);
            }
            setUploadingCert(false);

            // 3. Submit form
            const res = await fetch("/api/pandits/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    photo: photoUrl,
                    certifications: certUrls,
                }),
            });
            const json = await res.json();
            if (json.success) {
                setSubmitted(true);
            } else {
                setError(json.error || "Something went wrong");
            }
        } catch (err: any) {
            setError(err.message || "Failed to submit. Please try again.");
        } finally {
            setLoading(false);
            setUploadingPhoto(false);
            setUploadingCert(false);
        }
    }

    // ── Success ──
    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warm-50 px-4 py-20">
                <div className="mx-auto max-w-md animate-fade-in-up">
                    <div className="flex flex-col items-center rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-10 text-center shadow-lg">
                        <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 size={56} className="text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-warm-900">Thank You! 🙏</h2>
                        <p className="mt-4 text-warm-600 leading-relaxed">
                            Your application has been submitted successfully.<br />
                            <strong>Our team will contact you within 24 hours.</strong>
                        </p>
                        <p className="mt-3 text-sm text-warm-500">
                            Once verified, your profile will be visible to thousands of devotees.
                        </p>
                        <a href="/" className="mt-8 rounded-full bg-saffron-500 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-saffron-600">
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ── Form ──
    return (
        <div className="min-h-screen bg-warm-50">
            {/* Header */}
            <section className="bg-gradient-to-br from-warm-900 to-warm-800 py-14 text-center text-white md:py-20">
                <div className="section-wrap">
                    <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-saffron-300">
                        <UserPlus size={14} /> {isAstrologer ? "Join as Astrologer" : "Join as Pandit"}
                    </div>
                    <h1 className="font-heading text-3xl font-bold md:text-5xl">
                        {isAstrologer ? "Become a SmartPandit Astrologer" : "Become a SmartPandit Pandit"}
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-warm-200 md:text-lg">
                        Serve devotees across India. Fill in your details below and our team will verify your profile.
                    </p>
                </div>
            </section>

            {/* Form */}
            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-3xl px-4">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* ── 1. Photo Upload ── */}
                        <FormSection title="Profile Photo" number={1}>
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                                <div
                                    onClick={() => photoInputRef.current?.click()}
                                    className="group relative flex size-32 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-warm-300 bg-warm-50 transition hover:border-saffron-400 hover:bg-saffron-50/30"
                                >
                                    {photoPreview ? (
                                        <>
                                            <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                                                <Camera size={24} className="text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-warm-400">
                                            <Camera size={28} />
                                            <span className="text-[10px] font-medium">Tap to upload</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handlePhotoSelect}
                                    className="hidden"
                                />
                                <div className="flex-1 text-sm">
                                    <p className="font-semibold text-warm-800">Upload your photo</p>
                                    <p className="mt-1 text-xs text-warm-500">JPG, PNG or WebP. Max 5MB. This will be shown on your profile card.</p>
                                    {photoPreview && (
                                        <button type="button" onClick={removePhoto} className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600">
                                            <Trash2 size={12} /> Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </FormSection>

                        {/* ── 2. Personal Info ── */}
                        <FormSection title="Personal Information" number={2}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Label required>Full Name</Label>
                                    <input value={form.name} onChange={e => updateField("name", e.target.value)} required placeholder="e.g. Pandit Ramesh Sharma" className={inputClass} />
                                </div>
                                <div>
                                    <Label required>Email</Label>
                                    <input type="email" value={form.email} onChange={e => updateField("email", e.target.value)} required placeholder="your@email.com" className={inputClass} />
                                </div>
                                <div>
                                    <Label required>Mobile Number</Label>
                                    <input type="tel" value={form.phone} onChange={e => updateField("phone", e.target.value)} required placeholder="+91 9876543210" className={inputClass} />
                                </div>
                                <div>
                                    <Label>Date of Birth</Label>
                                    <input type="date" value={form.dateOfBirth} onChange={e => updateField("dateOfBirth", e.target.value)} className={inputClass} />
                                </div>
                            </div>
                        </FormSection>

                        {/* ── 3. Address ── */}
                        <FormSection title="Address" number={3}>
                            <div className="mb-4">
                                <button
                                    type="button"
                                    onClick={detectLocation}
                                    disabled={detectingLocation}
                                    className="flex items-center gap-2 rounded-xl border border-saffron-200 bg-saffron-50 px-5 py-3 text-sm font-semibold text-saffron-700 transition hover:bg-saffron-100 disabled:opacity-50"
                                >
                                    {detectingLocation ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                                    {detectingLocation ? "Detecting..." : "📍 Detect My Location"}
                                </button>
                                {form.lat > 0 && (
                                    <p className="mt-2 text-xs text-green-600 font-medium">✓ Location detected: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}</p>
                                )}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Label>Full Address</Label>
                                    <textarea value={form.address} onChange={e => updateField("address", e.target.value)} placeholder="House no, Street, Locality..." rows={2} className={inputClass + " resize-none"} />
                                </div>
                                <div>
                                    <Label required>City</Label>
                                    <input value={form.city} onChange={e => updateField("city", e.target.value)} required placeholder="e.g. Varanasi" className={inputClass} />
                                </div>
                                <div>
                                    <Label required>State</Label>
                                    <select value={form.state} onChange={e => updateField("state", e.target.value)} required className={inputClass}>
                                        <option value="">Select State</option>
                                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <Label>Pincode</Label>
                                    <input value={form.pincode} onChange={e => updateField("pincode", e.target.value)} placeholder="e.g. 221001" className={inputClass} />
                                </div>
                            </div>
                        </FormSection>

                        {/* ── 4. Experience & Expertise ── */}
                        <FormSection title="Experience & Expertise" number={4}>
                            <div>
                                <Label>Years of Experience</Label>
                                <input type="number" value={form.experience} onChange={e => updateField("experience", e.target.value)} placeholder="e.g. 5" min={0} className={inputClass + " max-w-[200px]"} />
                            </div>
                            <div className="mt-5">
                                <Label>Specializations (select all that apply)</Label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {SPECIALIZATIONS.map(spec => (
                                        <button
                                            key={spec}
                                            type="button"
                                            onClick={() => toggleSpecialization(spec)}
                                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${form.specializations.includes(spec)
                                                    ? "border-saffron-400 bg-saffron-50 text-saffron-700 shadow-sm"
                                                    : "border-warm-200 bg-white text-warm-600 hover:border-saffron-200 hover:bg-saffron-50/50"
                                                }`}
                                        >
                                            {form.specializations.includes(spec) && "✓ "}{spec}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </FormSection>

                        {/* ── 5. Astrology Toggle ── */}
                        <FormSection title="Astrology Services" number={5}>
                            <div className="flex items-center justify-between rounded-2xl border border-warm-200 bg-white p-5">
                                <div>
                                    <p className="font-semibold text-warm-900">Do you provide Astrology services?</p>
                                    <p className="text-xs text-warm-500 mt-1">Kundli, horoscope, Vastu consultation, etc.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => updateField("providesAstrology", !form.providesAstrology)}
                                    className={`relative h-7 w-12 rounded-full transition-colors ${form.providesAstrology ? "bg-saffron-500" : "bg-warm-300"}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${form.providesAstrology ? "translate-x-5" : "translate-x-0"}`} />
                                </button>
                            </div>
                        </FormSection>

                        {/* ── 6. Certifications Upload ── */}
                        <FormSection title="Certifications (Optional)" number={6}>
                            <p className="mb-4 text-xs text-warm-500">Upload certificates, degrees, or verification documents. JPG, PNG, WebP, or PDF. Max 5MB each.</p>

                            {/* Uploaded files list */}
                            {certFiles.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    {certFiles.map((cert, idx) => (
                                        <div key={idx} className="flex items-center gap-3 rounded-xl border border-warm-100 bg-warm-50/50 p-3">
                                            {cert.preview ? (
                                                <img src={cert.preview} alt="" className="size-12 rounded-lg object-cover" />
                                            ) : (
                                                <div className="flex size-12 items-center justify-center rounded-lg bg-saffron-50 text-saffron-500">
                                                    <FileText size={20} />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-warm-800 truncate">{cert.name}</p>
                                                <p className="text-[10px] text-warm-400">{(cert.file.size / 1024).toFixed(0)} KB</p>
                                            </div>
                                            <button type="button" onClick={() => removeCert(idx)} className="flex size-8 items-center justify-center rounded-full text-warm-400 transition hover:bg-red-50 hover:text-red-500">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => certInputRef.current?.click()}
                                className="flex items-center gap-2 rounded-xl border-2 border-dashed border-warm-300 bg-warm-50/50 px-5 py-4 text-sm font-semibold text-warm-600 transition hover:border-saffron-400 hover:bg-saffron-50/30 hover:text-saffron-700 w-full justify-center"
                            >
                                <Upload size={18} />
                                Upload Certificate
                            </button>
                            <input
                                ref={certInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                onChange={handleCertSelect}
                                multiple
                                className="hidden"
                            />
                        </FormSection>

                        {/* ── Error ── */}
                        {error && (
                            <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600">{error}</div>
                        )}

                        {/* ── Submit ── */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    {uploadingPhoto ? "Uploading Photo..." : uploadingCert ? "Uploading Certificates..." : "Submitting..."}
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Submit Application
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-warm-400">
                            By submitting, you agree to SmartPandit's terms. Your profile will be verified by our team within 24 hours.
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
}

// ── Helpers ──
const inputClass =
    "w-full rounded-xl border border-warm-200 bg-warm-50/50 px-4 py-3 text-sm transition placeholder:text-warm-300 focus:border-saffron-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-100";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="mb-1.5 block text-xs font-semibold text-warm-600">
            {children} {required && <span className="text-red-400">*</span>}
        </label>
    );
}

function FormSection({ title, number, children }: { title: string; number: number; children: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-warm-100 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-saffron-100 text-sm font-bold text-saffron-600">{number}</div>
                <h3 className="font-heading text-lg font-bold text-warm-900">{title}</h3>
            </div>
            {children}
        </div>
    );
}

export default function JoinPanditPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-saffron-500" size={32} /></div>}>
            <JoinPanditFormContent />
        </Suspense>
    );
}
