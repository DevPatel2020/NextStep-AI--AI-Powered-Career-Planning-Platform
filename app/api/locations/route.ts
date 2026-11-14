import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type LocationsData = Record<string, Record<string, string[]>>;
let cachedLocations: LocationsData | null = null;

function loadLocations(): LocationsData | null {
    if (cachedLocations) return cachedLocations;
    const filePath = path.join(process.cwd(), "data", "locations.json");
    if (!fs.existsSync(filePath)) return null;
    cachedLocations = JSON.parse(fs.readFileSync(filePath, "utf-8")) as LocationsData;
    return cachedLocations;
}

const has = (obj: object, key: string | null): key is string =>
    !!key && Object.prototype.hasOwnProperty.call(obj, key);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type"); // "countries", "states", "cities"
        const country = searchParams.get("country");
        const state = searchParams.get("state");

        const locationsData = loadLocations();
        if (!locationsData) {
            return NextResponse.json({ error: "Location data not found" }, { status: 404 });
        }

        if (type === "countries") {
            const countries = Object.keys(locationsData).sort();
            return NextResponse.json(countries);
        }

        if (type === "states") {
            if (!has(locationsData, country)) {
                return NextResponse.json([], { status: 200 }); // Return empty if country not found
            }
            const states = Object.keys(locationsData[country]).sort();
            return NextResponse.json(states);
        }

        if (type === "cities") {
            if (!has(locationsData, country) || !has(locationsData[country], state)) {
                return NextResponse.json([], { status: 200 }); // Return empty if not found
            }
            const cities = [...new Set<string>(locationsData[country][state])];
            return NextResponse.json(cities); // Already sorted in JSON
        }

        return NextResponse.json({ error: "Invalid type requested" }, { status: 400 });

    } catch (error) {
        console.error("Location API Error:", error);
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }
}
