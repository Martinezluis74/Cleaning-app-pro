import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { WizardState } from '@/types/wizard';

export const generateProposalPDF = (state: WizardState) => {
    const doc = new jsPDF();
    const { client, site, totals } = state;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text('BLUE GLOVES CLEANING', 14, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 14, 32);

    // Client Info
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text('PREPARED FOR:', 14, 45);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    let clientY = 53;
    if (client.company) { doc.text(client.company, 14, clientY); clientY += 6; }
    if (client.name) { doc.text(`ATTN: ${client.name}`, 14, clientY); clientY += 6; }
    if (client.email) { doc.text(client.email, 14, clientY); clientY += 6; }
    if (client.phone) { doc.text(client.phone, 14, clientY); clientY += 6; }

    // Scope of Work
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text('SCOPE OF WORK', 14, clientY + 15);

    const totalRestrooms = (site.fixtures?.rooms || 0) + (site.restrooms?.length || 0);

    autoTable(doc, {
        startY: clientY + 20,
        head: [['Service Metric', 'Details']],
        body: [
            ['Total Cleaning Area', `${totals.totalSqft.toLocaleString('en-US')} SqFt`],
            ['Restrooms / Wet Areas', `${totalRestrooms > 0 ? totalRestrooms : 1} Units`],
            ['Cleaning Frequency', `${site.cleaningFrequency || 1} Days / Week`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 11, cellPadding: 6, font: 'helvetica' },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80 }
        }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Monthly Investment (Calculated derived from monthlySubtotal)
    // We isolate and calculate purely monthly values to hide internal weekly margins/buffer
    const monthlySubtotal = totals.monthlySubtotal;
    const monthlyTax = monthlySubtotal * 0.13;
    const monthlyTotal = monthlySubtotal + monthlyTax;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text('MONTHLY INVESTMENT', 14, finalY);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Description', 'Amount']],
        body: [
            ['Monthly Contract Value', `$${monthlySubtotal.toFixed(2)}`],
            ['HST (13%)', `$${monthlyTax.toFixed(2)}`],
            ['TOTAL MONTHLY VALUE', `$${monthlyTotal.toFixed(2)}`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 12, cellPadding: 6, font: 'helvetica' },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 100 },
            1: { fontStyle: 'bold', halign: 'right' }
        }
    });

    const signatureY = (doc as any).lastAutoTable.finalY + 40;

    // Closing
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('Accepted by: ___________________________________', 14, signatureY);
    doc.text('Date: ________________', 130, signatureY);

    const filename = `${client.company ? client.company.replace(/\s+/g, '_') : 'Client'}_Proposal.pdf`;
    doc.save(filename);
};
