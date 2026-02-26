import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import JSZip from "jszip";
import { parse } from "csv-parse/sync";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file || !file.name.endsWith(".zip")) {
            return NextResponse.json({ error: "Invalid file. Please upload a .zip file." }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(buffer);

        let tenant = await prisma.tenant.findFirst();
        if (!tenant) {
            tenant = await prisma.tenant.create({
                data: { name: "Default Tenant", users: { create: { email: "admin@cleaningpro.ca" } } }
            });
        }

        const datasetVersion = await prisma.datasetVersion.create({
            data: {
                tenantId: tenant.id,
                versionName: `Import-${new Date().toISOString()}`,
                status: "ACTIVE"
            }
        });

        const parseTSV = async (filename: string) => {
            // Support lowercase or uppercase variants
            const file = zip.file(filename) || zip.file(filename.toUpperCase());
            if (!file) return [];
            const text = await file.async("text");
            return parse(text, { delimiter: "\t", columns: true, skip_empty_lines: true });
        };

        const inventories = await parseTSV("INVENTORY.tsv");
        const tasks = await parseTSV("DIM_TASK.tsv");
        const rates = await parseTSV("FACT_TASK_RATES.tsv");
        const prices = await parseTSV("FACT_TASK_PRICES.tsv");
        const assumptions = await parseTSV("DIM_ASSUMPTIONS.tsv");

        if (inventories.length) {
            await prisma.inventory.createMany({
                data: inventories.map((row: any, i: number) => ({
                    datasetVersionId: datasetVersion.id,
                    itemName: row.itemName || "Unknown",
                    cost: parseFloat(row.cost) || 0,
                    sourceDocId: "INVENTORY.tsv",
                    sourceRef: `Line ${i + 2}`,
                }))
            });
        }

        if (tasks.length) {
            await prisma.dimTask.createMany({
                data: tasks.map((row: any, i: number) => ({
                    datasetVersionId: datasetVersion.id,
                    taskName: row.taskName || row.taskId || "Unknown",
                    description: row.description || "",
                    sourceDocId: "DIM_TASK.tsv",
                    sourceRef: row.taskId || `Line ${i + 2}`,
                }))
            });
        }

        if (rates.length) {
            await prisma.factTaskRate.createMany({
                data: rates.map((row: any, i: number) => ({
                    datasetVersionId: datasetVersion.id,
                    taskId: row.taskId || "",
                    rateValue: parseFloat(row.rateValue || row.rate) || 0,
                    sourceDocId: "FACT_TASK_RATES.tsv",
                    sourceRef: `Line ${i + 2}`,
                }))
            });
        }

        if (prices.length) {
            await prisma.factTaskPrice.createMany({
                data: prices.map((row: any, i: number) => ({
                    datasetVersionId: datasetVersion.id,
                    taskId: row.taskId || "",
                    priceValue: parseFloat(row.priceValue || row.price) || 0,
                    sourceDocId: "FACT_TASK_PRICES.tsv",
                    sourceRef: `Line ${i + 2}`,
                }))
            });
        }

        if (assumptions.length) {
            await prisma.dimAssumptions.createMany({
                data: assumptions.map((row: any, i: number) => ({
                    datasetVersionId: datasetVersion.id,
                    key: row.key || row.assumptionKey || "UNKNOWN",
                    value: parseFloat(row.value) || 0,
                    sourceDocId: "DIM_ASSUMPTIONS.tsv",
                    sourceRef: `Line ${i + 2}`,
                }))
            });
        }

        return NextResponse.json({
            success: true,
            versionName: datasetVersion.versionName,
            stats: {
                inventories: inventories.length,
                tasks: tasks.length,
                rates: rates.length,
                prices: prices.length,
                assumptions: assumptions.length
            }
        });

    } catch (err: any) {
        console.error("ZIP processing error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
