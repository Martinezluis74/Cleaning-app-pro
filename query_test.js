const { PrismaClient } = require('@prisma/client');

async function test() {
    const prisma = new PrismaClient();
    const assumptions = await prisma.dimAssumptions.findMany({ take: 5 });
    const tasks = await prisma.dimTask.findMany({ take: 5 });
    const rates = await prisma.factTaskRate.findMany({ take: 5 });

    console.log("ASSUMPTIONS:", assumptions);
    console.log("TASKS:", tasks);
    console.log("RATES:", rates);
    process.exit(0);
}

test();
