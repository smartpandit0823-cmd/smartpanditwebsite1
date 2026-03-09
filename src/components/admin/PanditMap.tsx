"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";

const containerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "0.75rem",
};

export function PanditMap({
    pandits,
}: {
    pandits: { _id: string; name: string; lat?: number; lng?: number; city: string }[];
}) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const center = useMemo(() => {
        // If we have any pandits with lat/lng, center on the first one, else center on India
        const valid = pandits.filter((p) => p.lat && p.lng);
        if (valid.length > 0) {
            return { lat: valid[0].lat!, lng: valid[0].lng! };
        }
        return { lat: 20.5937, lng: 78.9629 };
    }, [pandits]);

    if (!isLoaded) return <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-warm-200 bg-warm-50">Loading Map...</div>;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
            {pandits.map((p) => {
                if (!p.lat || !p.lng) return null;
                return (
                    <Marker
                        key={p._id}
                        position={{ lat: p.lat, lng: p.lng }}
                        title={p.name + " • " + p.city}
                    />
                );
            })}
        </GoogleMap>
    );
}
