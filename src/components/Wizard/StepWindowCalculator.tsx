import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepWindowCalculator() {
    // ---- Window Types State (Quantities) ----
    const [qtyBasic, setQtyBasic] = useState<number | ''>(''); // 0.40 min
    const [qtyDeep, setQtyDeep] = useState<number | ''>('');   // 2.5 min
    const [qtyPatio, setQtyPatio] = useState<number | ''>(''); // 2.0 min

    // ---- Financial State ----
    const [overhead, setOverhead] = useState<number | ''>(0);
    const [markup, setMarkup] = useState<number | ''>(45);

    // ---- Calculation Engine ----
    const windowVals = useMemo(() => {
        const qB = Number(qtyBasic) || 0;
        const qD = Number(qtyDeep) || 0;
        const qP = Number(qtyPatio) || 0;
        const ov = Number(overhead) || 0;
        const mk = Number(markup) || 0;

        // Total minutes
        const totalMinutes = (qB * 0.40) + (qD * 2.5) + (qP * 2.0);

        // Base Labor Rate ($27/hr = $0.45/min)
        const baseLaborCost = totalMinutes * 0.45;

        // Apply Overhead
        const costWithOverhead = baseLaborCost * (1 + (ov / 100));

        // Apply Markup: Cost / (1 - Margin)
        const finalPrice = mk < 100 ? costWithOverhead / (1 - (mk / 100)) : costWithOverhead;

        // Time Formatting (Hours and Minutes)
        const hours = Math.floor(totalMinutes / 60);
        const mins = Math.round(totalMinutes % 60);
        const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

        return {
            totalMinutes,
            timeString,
            baseLaborCost,
            finalPrice
        };
    }, [qtyBasic, qtyDeep, qtyPatio, overhead, markup]);

    return (
        <div className="w-full">
            {/* SCREEN VIEW */}
            <div className="flex flex-col space-y-8 w-full max-w-5xl mx-auto p-4 print:hidden">

                {/* Header Action Bar */}
                <div className="flex justify-end print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-3 px-8 rounded shadow-xl transition-all flex items-center gap-3 active:scale-95"
                    >
                        <span className="text-xl">📄</span> GENERATE PROPOSAL (PDF)
                    </button>
                </div>

                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="bg-slate-100 border-b-4 border-black pb-4">
                        <CardTitle className="text-2xl font-black uppercase tracking-widest text-black">
                            Window Cleaning Economics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Inputs: Quantities & Financials */}
                        <div className="space-y-6">

                            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-4">
                                <h3 className="font-black uppercase tracking-widest text-blue-900 border-b-2 border-blue-200 pb-2">Panel Quantities</h3>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Basic Spray & Wipe (Qty)</Label>
                                    <Input
                                        type="number"
                                        value={qtyBasic}
                                        onChange={(e) => setQtyBasic(e.target.value ? Number(e.target.value) : '')}
                                        className="border-2 border-black font-bold text-lg"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Deep Clean Squeegee/Frame (Qty)</Label>
                                    <Input
                                        type="number"
                                        value={qtyDeep}
                                        onChange={(e) => setQtyDeep(e.target.value ? Number(e.target.value) : '')}
                                        className="border-2 border-black font-bold text-lg"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Large Patio Doors (Qty)</Label>
                                    <Input
                                        type="number"
                                        value={qtyPatio}
                                        onChange={(e) => setQtyPatio(e.target.value ? Number(e.target.value) : '')}
                                        className="border-2 border-black font-bold text-lg"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-lg space-y-4">
                                <h3 className="font-black uppercase tracking-widest text-slate-700 border-b-2 border-slate-200 pb-2">Financial Overrides</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Overhead (%)</Label>
                                        <Input
                                            type="number"
                                            value={overhead}
                                            onChange={(e) => setOverhead(e.target.value ? Number(e.target.value) : '')}
                                            className="border-2 border-black font-bold text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Markup (%)</Label>
                                        <Input
                                            type="number"
                                            value={markup}
                                            onChange={(e) => setMarkup(e.target.value ? Number(e.target.value) : '')}
                                            className="border-2 border-black font-bold text-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Outputs: Diagnostic Dashboard */}
                        <div className="bg-black text-white p-6 rounded-xl flex flex-col justify-center space-y-6">

                            <div className="flex justify-between border-b border-gray-700 pb-2 items-end">
                                <span className="font-bold uppercase tracking-widest text-sm text-gray-400">Total Estimated Time:</span>
                                <span className="font-black text-xl text-blue-400">{windowVals.timeString}</span>
                            </div>

                            <div className="flex justify-between border-b border-gray-700 pb-2 items-end">
                                <span className="font-bold uppercase tracking-widest text-sm text-gray-400">Base Labor Cost:</span>
                                <span className="font-black text-xl">${windowVals.baseLaborCost.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between pt-4 items-end">
                                <span className="font-black uppercase tracking-widest text-lg text-green-400">Final Project Price:</span>
                                <span className="font-black text-5xl text-white">${windowVals.finalPrice.toFixed(2)}</span>
                            </div>

                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* PRINT INVOICE VIEW */}
            <div className="hidden print:block print:w-full print:h-[95vh] print:flex print:flex-col print:justify-between print:overflow-hidden w-full max-w-[8.5in] mx-auto bg-white text-black font-sans py-10 px-8 print:py-0 print:px-0">
                {/* Header */}
                <div className="border-b-4 border-black pb-6 mb-10 print:pb-2 print:mb-4 flex justify-between items-end shrink-0">
                    <div>
                        <h1 className="text-4xl print:text-2xl font-black uppercase tracking-widest text-blue-900">Blue Gloves Cleaning</h1>
                        <h2 className="text-2xl print:text-lg font-bold uppercase tracking-wider mt-2 print:mt-1">Service Proposal</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Date</p>
                        <p className="text-black font-black text-lg print:text-base">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Scope of Work */}
                <div className="mb-16 print:mb-4 min-h-[400px] print:min-h-0 flex-grow">
                    <h3 className="text-xl print:text-lg font-black uppercase tracking-widest bg-black text-white p-3 print:p-2 mb-6 print:mb-4">Scope of Work</h3>
                    <div className="space-y-10 print:space-y-4">

                        {windowVals.totalMinutes > 0 && (
                            <div className="border-l-4 border-blue-600 pl-6 print:pl-4 print:break-inside-avoid">
                                <h4 className="text-xl print:text-lg font-black uppercase tracking-wider">Professional Window Cleaning</h4>
                                <div className="mt-4 print:mt-2 space-y-1">
                                    {Number(qtyBasic) > 0 && <p className="text-slate-600 font-bold text-lg print:text-sm">• Basic Spray & Wipe: {Number(qtyBasic).toLocaleString()} panels</p>}
                                    {Number(qtyDeep) > 0 && <p className="text-slate-600 font-bold text-lg print:text-sm">• Deep Clean Squeegee/Frame: {Number(qtyDeep).toLocaleString()} panels</p>}
                                    {Number(qtyPatio) > 0 && <p className="text-slate-600 font-bold text-lg print:text-sm">• Large Patio Doors: {Number(qtyPatio).toLocaleString()} doors</p>}
                                </div>
                                <div className="mt-8 print:mt-4 flex justify-between items-end border-b-2 border-slate-200 pb-2 print:pb-1">
                                    <span className="text-sm print:text-xs font-bold uppercase tracking-widest text-slate-500">Project Investment:</span>
                                    <span className="text-3xl print:text-xl font-black">${windowVals.finalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {windowVals.totalMinutes === 0 && (
                            <p className="text-slate-500 italic text-lg print:text-sm text-center py-10 print:py-4 border-2 border-dashed border-slate-300">
                                No window cleaning services selected.
                            </p>
                        )}
                    </div>
                </div>

                {/* Signatures */}
                <div className="mt-auto pt-10 print:pt-4 border-t-2 border-slate-300 grid grid-cols-2 gap-16 print:gap-8 shrink-0 print:break-inside-avoid">
                    <div>
                        <p className="font-bold uppercase tracking-widest text-sm print:text-xs text-slate-500 mb-12 print:mb-8">Accepted by Blue Gloves Cleaning</p>
                        <div className="border-b-2 border-black w-full"></div>
                        <p className="text-xs font-bold text-slate-400 mt-3 print:mt-1 uppercase tracking-wider">Authorized Signature</p>
                    </div>
                    <div>
                        <p className="font-bold uppercase tracking-widest text-sm print:text-xs text-slate-500 mb-12 print:mb-8">Client Acceptance</p>
                        <div className="border-b-2 border-black w-full"></div>
                        <p className="text-xs font-bold text-slate-400 mt-3 print:mt-1 uppercase tracking-wider">Client Signature & Date</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
