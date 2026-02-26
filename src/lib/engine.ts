import { prisma } from "@/lib/db";

export async function calculateSampleQuote(sqft: number = 5000, frequency: string = "Weekly") {
    console.log(`\n--- CALCULATING QUOTE FOR ${sqft} sqft | ${frequency} ---`);

    // 1. Get the ACTIVE dataset version
    const activeVersion = await prisma.datasetVersion.findFirst({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" }
    });

    if (!activeVersion) {
        throw new Error("No ACTIVE dataset version found.");
    }

    // 2. Fetch all required Base Assumptions
    const assumptions = await prisma.dimAssumptions.findMany({
        where: { datasetVersionId: activeVersion.id }
    });

    const getAssumption = (key: string, fallback: number) => {
        const a = assumptions.find(a => a.key === key);
        return a ? { value: a.value, source: a.sourceRef } : { value: fallback, source: 'DEFAULT_FALLBACK' };
    };

    const baseWageRate = getAssumption('WageAllIn_CAD', 17.55);
    const overheadMargin = getAssumption('MarginTarget', 0.20);
    const markupTarget = getAssumption('MarkupTarget', 0.25);
    const hstTax = getAssumption('HST_TAX_RATE', 0.13);

    console.log(`\nAssumptions Loaded:`);
    console.log(`- Base Wage: $${baseWageRate.value}/hr (Source: ${baseWageRate.source})`);
    console.log(`- Target Margin: ${overheadMargin.value * 100}% (Source: ${overheadMargin.source})`);
    console.log(`- Target Markup: ${markupTarget.value * 100}% (Source: ${markupTarget.source})`);
    console.log(`- HST Tax: ${hstTax.value * 100}% (Source: ${hstTax.source})`);

    // 3. Fetch rates and prices for the active version
    const rates = await prisma.factTaskRate.findMany({
        where: { datasetVersionId: activeVersion.id }
    });

    // Fetch 5 actual general tasks
    const generalTasks = await prisma.dimTask.findMany({
        where: {
            datasetVersionId: activeVersion.id,
            description: {
                contains: 'General'
            }
        },
        take: 5
    });

    if (generalTasks.length === 0) {
        console.error("No 'General' tasks found in dataset to quote. Trying any 5 tasks...");
        generalTasks.push(...await prisma.dimTask.findMany({ where: { datasetVersionId: activeVersion.id }, take: 5 }));
    }

    let totalMinutesPerVisit = 0;
    const traceLog: any[] = [];

    for (const task of generalTasks) {
        // Find the matching production rate for this task by TaskID (sourceRef)
        const rateEntry = rates.find(r => r.taskId === task.sourceRef);

        // Golden Rule Constraint: Unfound task rates mark as NEEDS_INPUT
        if (!rateEntry || rateEntry.rateValue === 0) {
            traceLog.push({
                task: task.taskName || task.sourceRef,
                status: "NEEDS_INPUT",
                reason: `Missing valid FACT_TASK_RATE value for TaskID: ${task.sourceRef}`
            });
            continue;
        }

        // Assuming BaseTime_Min is Minutes per 1000 sq ft. 
        const multiplier = sqft / 1000;
        const taskMinutes = rateEntry.rateValue * multiplier;
        totalMinutesPerVisit += taskMinutes;

        traceLog.push({
            task: task.taskName,
            status: "CALCULATED",
            minutes: taskMinutes.toFixed(2),
            calculation: `(${sqft} sqft / 1000) * ${rateEntry.rateValue} base minutes`,
            sourceRef: `FACT_TASK_RATES -> ${rateEntry.sourceRef} (Task: ${task.sourceRef})`
        });
    }

    // 4. Calculate final values based on minutes and wage
    const totalHoursPerVisit = totalMinutesPerVisit / 60;

    // Frequency multiplier
    let visitsPerMonth = 4.33; // Default Weekly
    if (frequency === "Daily") visitsPerMonth = 21.6;
    if (frequency === "Bi-Weekly") visitsPerMonth = 2.16;
    if (frequency === "Monthly") visitsPerMonth = 1;

    const monthlyLaborCost = totalHoursPerVisit * baseWageRate.value * visitsPerMonth;

    // Price buildup based on Ontario logic (Labor + Markup = Subtotal)
    // We use MarkupTarget for profit/overhead loading.
    const overheadAndProfit = monthlyLaborCost * markupTarget.value;
    const subTotal = monthlyLaborCost + overheadAndProfit;
    const taxes = subTotal * hstTax.value;
    const totalWithTax = subTotal + taxes;

    const finalQuote = {
        workspace: `${sqft} sq.ft.`,
        frequency: frequency,
        visitsPerMonth: visitsPerMonth,
        perVisitLaborHours: totalHoursPerVisit.toFixed(2),
        monthlyLaborHours: (totalHoursPerVisit * visitsPerMonth).toFixed(2),
        costs: {
            monthlyLaborCost: `$${monthlyLaborCost.toFixed(2)}`,
            overheadAndProfit: `$${overheadAndProfit.toFixed(2)}`,
            subTotal: `$${subTotal.toFixed(2)}`,
            taxes: `$${taxes.toFixed(2)}`,
            totalMonthlyPrice: `$${totalWithTax.toFixed(2)}`
        },
        traceabilityLog: traceLog
    };

    console.log("\n--- QUOTE GENERATED SUCCESSFULLY ---");
    console.log(JSON.stringify(finalQuote, null, 2));

    return finalQuote;
}

if (require.main === module) {
    calculateSampleQuote(5000, "Weekly")
        .then(() => process.exit(0))
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
}
