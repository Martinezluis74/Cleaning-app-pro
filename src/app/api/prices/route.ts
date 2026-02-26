import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Fetch the ACTIVE dataset version (or the most recent if none is active)
        const dataset = await prisma.datasetVersion.findFirst({
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            include: {
                taskPrices: true,
                assumptions: true,
            },
        });

        if (!dataset) {
            // Fallback to the latest Draft if no Active exists
            const fallbackDataset = await prisma.datasetVersion.findFirst({
                orderBy: { createdAt: "desc" },
                include: {
                    taskPrices: true,
                    assumptions: true,
                },
            });

            if (!fallbackDataset) {
                return NextResponse.json({ error: "No dataset available in the database" }, { status: 404 });
            }

            return NextResponse.json(fallbackDataset);
        }

        return NextResponse.json(dataset);

    } catch (err: any) {
        console.error("Prices API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
