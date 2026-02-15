
interface AddressComponents {
    street?: string;
    venue?: string;
    city: string;
    state: string;
    zip?: string;
}

interface GeocodeResult {
    lat: number;
    lng: number;
    zip?: string;
    source: string;
}

async function tryGeocode(query: string, sourceName: string): Promise<GeocodeResult | null> {

    // 1. Try Mapbox
    if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        try {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1&types=postcode,place,address,poi`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const [l, t] = feature.center;

                // Extract Zip from Context
                let zip = "";
                // If the result itself is a postcode
                if (feature.place_type.includes('postcode')) {
                    zip = feature.text;
                }
                // Otherwise check context
                else if (feature.context) {
                    const zipContext = feature.context.find((c: any) => c.id.startsWith('postcode'));
                    if (zipContext) zip = zipContext.text;
                }

                return { lat: t, lng: l, zip, source: `Mapbox (${sourceName})` };
            }
        } catch (e) {
            console.error("Mapbox Geocoding failed", e);
        }
    }

    // 2. Try Nominatim
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
        const res = await fetch(url, { headers: { "User-Agent": "CarShowCalendar/1.0" } });
        const data = await res.json();
        if (data && data.length > 0) {
            const result = data[0];
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon),
                zip: result.address?.postcode || "",
                source: `Nominatim (${sourceName})`
            };
        }
    } catch (e) {
        console.error("Nominatim Geocoding failed", e);
    }

    return null;
}

export async function geocodeAddress(input: string | AddressComponents): Promise<{ lat: number, lng: number, zip?: string, source: string }> {
    let lat = 39.7817; // Default: Springfield, IL
    let lng = -89.6501;
    let source = "Fallback";
    let foundZip = "";

    // Is input just a string or components?
    // If components, we can try multiple strategies
    if (typeof input === 'string') {
        const result = await tryGeocode(input, "String");
        if (result) return result;
    } else {
        const { street, venue, city, state, zip } = input;

        // Strategy 1: Full details (Street, City, State, Zip) - No Venue (often confuses basic geocoders)
        if (street) {
            const q = `${street}, ${city}, ${state} ${zip || ''}`;
            const res = await tryGeocode(q, "Exact");
            if (res) return res;
        }

        // Strategy 2: Venue + City + State (Great for famous places)
        if (venue) {
            const q = `${venue}, ${city}, ${state}`;
            const res = await tryGeocode(q, "Venue");
            if (res) return res;
        }

        // Strategy 3: City + State + Zip (Broad)
        if (zip) {
            const q = `${city}, ${state} ${zip}`;
            const res = await tryGeocode(q, "Zip");
            if (res) return res;
        }

        // Strategy 4: City + State (Broadest)
        const q = `${city}, ${state}`;
        const res = await tryGeocode(q, "City");
        if (res) return res;
    }

    // 3. Final Fallback
    return { lat, lng, zip: foundZip, source };
}
