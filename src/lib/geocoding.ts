export async function geocodeAddress(address: string) {
    let lat = 39.7817; // Default: Springfield, IL
    let lng = -89.6501;
    let source = "Fallback";

    // 1. Try Mapbox if token exists
    if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        try {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                const [l, t] = data.features[0].center;
                return { lat: t, lng: l, source: "Mapbox" };
            }
        } catch (e) {
            console.error("Mapbox Geocoding failed", e);
        }
    }

    // 2. Fallback to OpenStreetMap (Nominatim) - Free, no key required
    try {
        // User-Agent is required by Nominatim TOS
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "CarShowCalendar/1.0"
            }
        });
        const data = await res.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                source: "Nominatim"
            };
        }
    } catch (e) {
        console.error("Nominatim Geocoding failed", e);
    }

    // 3. Final Fallback
    return { lat, lng, source };
}
