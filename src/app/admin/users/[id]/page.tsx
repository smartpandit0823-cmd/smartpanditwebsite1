import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/index";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Phone, Mail, Star } from "lucide-react";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await auth();
    const { id } = await params;
    await connectDB();

    const user = await User.findById(id).lean();
    if (!user) notFound();

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
                <Link href="/admin/users" className="flex size-9 items-center justify-center rounded-full border hover:bg-warm-50">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="font-heading text-2xl font-bold">{user.name || "User"}</h1>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                </div>
                <Badge className="ml-auto" variant={user.status === "active" ? "success" : "destructive"}>
                    {user.status}
                </Badge>
            </div>

            {/* Basic Info */}
            <Card>
                <CardHeader><CardTitle className="text-base">Basic Info</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Phone size={14} className="text-warm-400" />
                            <span>{user.phone}</span>
                        </div>
                        {user.email && (
                            <div className="flex items-center gap-2 text-sm">
                                <Mail size={14} className="text-warm-400" />
                                <span>{user.email}</span>
                            </div>
                        )}
                        {user.city && (
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin size={14} className="text-warm-400" />
                                <span>{user.city}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-warm-400" />
                            <span>Joined {formatDate(user.createdAt?.toString())}</span>
                        </div>
                        {user.gender && <div className="text-sm"><span className="text-gray-500">Gender:</span> {user.gender}</div>}
                        {user.gotra && <div className="text-sm"><span className="text-gray-500">Gotra:</span> {user.gotra}</div>}
                        {user.language && <div className="text-sm"><span className="text-gray-500">Language:</span> {user.language}</div>}
                        {user.authProvider && <div className="text-sm"><span className="text-gray-500">Auth:</span> {user.authProvider}</div>}
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-saffron-600">{user.totalBookings || 0}</p>
                        <p className="text-xs text-gray-500">Bookings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-saffron-600">{user.totalOrders || 0}</p>
                        <p className="text-xs text-gray-500">Orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-saffron-600">₹{(user.totalSpent || 0).toLocaleString("en-IN")}</p>
                        <p className="text-xs text-gray-500">Total Spent</p>
                    </CardContent>
                </Card>
            </div>

            {/* Addresses */}
            <Card>
                <CardHeader><CardTitle className="text-base">Saved Addresses ({user.addresses?.length || 0})</CardTitle></CardHeader>
                <CardContent>
                    {!user.addresses || user.addresses.length === 0 ? (
                        <p className="text-sm text-gray-400">No addresses saved</p>
                    ) : (
                        <div className="space-y-3">
                            {user.addresses.map((addr, i) => (
                                <div key={i} className="rounded-lg border p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary" className="text-xs">{addr.label}</Badge>
                                        {addr.isDefault && (
                                            <span className="flex items-center gap-0.5 text-[10px] text-green-700"><Star size={10} /> Default</span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium">{addr.fullName}</p>
                                    <p className="text-xs text-gray-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                                    <p className="text-xs text-gray-500">{addr.area ? `${addr.area}, ` : ""}{addr.city}, {addr.state} - {addr.pincode}</p>
                                    <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>
                                    {addr.lat && addr.lng && (
                                        <a
                                            href={`https://www.google.com/maps?q=${addr.lat},${addr.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                                        >
                                            <MapPin size={10} /> View on Map
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Birth Details */}
            {(user.dateOfBirth || user.birthTime || user.birthPlace) && (
                <Card>
                    <CardHeader><CardTitle className="text-base">🔮 Birth / Astrology Details</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {user.dateOfBirth && (
                                <div className="text-sm"><span className="text-gray-500">DOB:</span> {new Date(user.dateOfBirth).toLocaleDateString("en-IN")}</div>
                            )}
                            {user.birthTime && <div className="text-sm"><span className="text-gray-500">Birth Time:</span> {user.birthTime}</div>}
                            {user.birthPlace && <div className="text-sm"><span className="text-gray-500">Birth Place:</span> {user.birthPlace}</div>}
                            {user.gotra && <div className="text-sm"><span className="text-gray-500">Gotra:</span> {user.gotra}</div>}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
