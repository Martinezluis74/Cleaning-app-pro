import { NextResponse } from "next/server";
import { calculateSampleQuote } from "@/lib/engine";

export async function POST(req: Request) {
    try {
        const { sqft, frequency } = await req.json();

        if (!sqft || sqft <= 0) {
            return NextResponse.json({ error: "Invalid square footage" }, { status: 400 });
        }

        // Call the engine we built in M4
        const quote = await calculateSampleQuote(Number(sqft), frequency || "Weekly");

        return NextResponse.json(quote);
    } catch (err: any) {
        console.error("Quote API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
