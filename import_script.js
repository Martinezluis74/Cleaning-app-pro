const fs = require('fs');
const JSZip = require('jszip');
const { parse } = require('csv-parse/sync');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run() {
    try {
        const buffer = fs.readFileSync('cleaning_db_export_bundle_v4.zip');
        const zip = await JSZip.loadAsync(buffer);

        let tenant = await prisma.tenant.findFirst();

        // Create new DatasetVersion for fixed import
        const datasetVersion = await prisma.datasetVersion.create({
            data: {
                tenantId: tenant.id,
                versionName: `Import-Fixed-${new Date().toISOString()}`,
                status: "ACTIVE"
            }
        });

        const parseTSV = async (filename) => {
            const file = zip.file(filename);
            if (!file) return [];
            const text = await file.async("text");
            return parse(text, { delimiter: "\t", columns: true, skip_empty_lines: true });
        };

        const tasks = await parseTSV("DIM_TASK.tsv");
        const rates = await parseTSV("FACT_TASK_RATES.tsv");
        const assumptions = await parseTSV("DIM_ASSUMPTIONS.tsv");

        // Clear old garbage
        await prisma.dimTask.deleteMany({ where: { taskName: 'Unknown' } });
        await prisma.factTaskRate.deleteMany({ where: { taskId: '' } });

        console.log(`Inserting ${tasks.length} tasks...`);
        if (tasks.length) {
            await prisma.dimTask.createMany({
                data: tasks.map((row, i) => ({
                    datasetVersionId: datasetVersion.id,
                    taskName: row.TaskName_Canonical_EN || "Unknown",
                    description: `${row.Category} - ${row.Subcategory}`,
                    sourceDocId: "DIM_TASK.tsv",
                    sourceRef: row.TaskID || `Line ${i + 2}`,
                }))
            });
        }

        console.log(`Inserting ${rates.length} rates...`);
        if (rates.length) {
            await prisma.factTaskRate.createMany({
                data: rates.map((row, i) => ({
                    datasetVersionId: datasetVersion.id,
                    taskId: row.TaskID || "",
                    // Use BaseTime_Min or Time_Min_Minutes depending on what's available
                    rateValue: parseFloat(row.BaseTime_Min || row.Time_Min_Minutes || 0),
                    sourceDocId: "FACT_TASK_RATES.tsv",
                    sourceRef: row.RateID || `Line ${i + 2}`,
                }))
            });
        }

        console.log(`Inserting ${assumptions.length} assumptions...`);
        if (assumptions.length) {
            // In this TSV, assumption rules seem heavily pivoted onto row columns
            // We'll flatten the first row's primary keys into our DimAssumption table
            const row = assumptions[0];
            const kvPairs = [
                { key: 'WageAllIn_CAD', value: parseFloat(row.WageAllIn_CAD) || 17.55 },
                { key: 'MarginTarget', value: parseFloat(row.MarginTarget) || 0.20 },
                { key: 'MarkupTarget', value: parseFloat(row.MarkupTarget) || 0.25 },
                { key: 'HST_TAX_RATE', value: 0.13 }, // Hardcode standard Ontario HST since it wasn't listed
            ];

            await prisma.dimAssumptions.createMany({
                data: kvPairs.map(pair => ({
                    datasetVersionId: datasetVersion.id,
                    key: pair.key,
                    value: pair.value,
                    sourceDocId: "DIM_ASSUMPTIONS.tsv",
                    sourceRef: `AssumptionSetID: ${row.AssumptionSetID || 1}`,
                }))
            });
        }

        console.log("Fixed Import Complete.");

    } catch (error) {
        console.error("ERROR:", error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
