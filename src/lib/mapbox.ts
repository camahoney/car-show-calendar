export interface RouteStats {
    distance: number; // meters
    duration: number; // seconds
    geometry: any; // GeoJSON LineString
}

export async function getOptimizedRoute(coordinates: [number, number][]): Promise<RouteStats | null> {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || coordinates.length < 2) return null;

    // Mapbox expects "lng,lat" formatted coordinates separated by semicolons
    const coordString = coordinates.map(c => `${c[1]},${c[0]}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&overview=full&access_token=${token}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch route");

        const data = await res.json();
        if (!data.routes || data.routes.length === 0) return null;

        const route = data.routes[0];

        return {
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry
        };
    } catch (error) {
        console.error("Mapbox Route Error:", error);
        return null;
    }
}
