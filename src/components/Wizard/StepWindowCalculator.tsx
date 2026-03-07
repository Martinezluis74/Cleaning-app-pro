import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepWindowCalculator() {
    // ---- Window Inputs State ----
    const [qty1st, setQty1st] = useState<number | ''>('');
    const [qty2nd, setQty2nd] = useState<number | ''>('');
    const [qty3rd, setQty3rd] = useState<number | ''>('');

    const [scope, setScope] = useState<'Exterior Only' | 'Exterior & Interior'>('Exterior Only');
    const [condition, setCondition] = useState<'Standard Maintenance' | 'Post-Construction'>('Standard Maintenance');
    const [buffing, setBuffing] = useState<boolean>(false);

    // ---- Financial State ----
    const [tripCost, setTripCost] = useState<number | ''>('');
    const [overhead, setOverhead] = useState<number | ''>(0);
    const [markup, setMarkup] = useState<number | ''>(45);

    // ---- Calculation Engine ----
    const windowVals = useMemo(() => {
        const q1 = Number(qty1st) || 0;
        const q2 = Number(qty2nd) || 0;
        const q3 = Number(qty3rd) || 0;
        const ov = Number(overhead) || 0;
        const mk = Number(markup) || 0;
        const trip = Number(tripCost) || 0;

        // Multipliers
        const sides = scope === 'Exterior & Interior' ? 2 : 1;
        const conditionMult = condition === 'Post-Construction' ? 2.0 : 1.0;

        // Base times per side
        const baseTimePerSide = 3;
        const buffingPerSide = buffing ? 1 : 0;

        // Window Unit Time (Base Minutes per window)
        const baseTimeCurrent = baseTimePerSide * sides;
        const buffingCurrent = buffingPerSide * sides;

        // Minutos Base Ajustados por Condicion = (3 mins + buffing) * Sides * Condition
        const adjustedMinsPerWindow = (baseTimeCurrent + buffingCurrent) * conditionMult;

        // Total minutes formula based on specific floor counts
        const totalMinutes =
            (q1 * adjustedMinsPerWindow * 1.0) +
            (q2 * adjustedMinsPerWindow * 1.2) +
            (q3 * adjustedMinsPerWindow * 1.5);

        // Labor Rate ($27/hr = $0.45/min)
        const laborCost = totalMinutes * 0.45;
        const totalBaseCost = laborCost + trip;

        // Apply Overhead & Markup
        const costWithOverhead = totalBaseCost * (1 + (ov / 100));
        const finalPrice = mk < 100 ? costWithOverhead / (1 - (mk / 100)) : costWithOverhead;

        // Time Formatting
        const hours = Math.floor(totalMinutes / 60);
        const mins = Math.round(totalMinutes % 60);
        const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

        return {
            totalQty: q1 + q2 + q3,
            totalMinutes,
            timeString,
            laborCost,
            tripCost: trip,
            totalBaseCost,
            finalPrice
        };
    }, [qty1st, qty2nd, qty3rd, scope, condition, buffing, tripCost, overhead, markup]);

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
                        {/* Inputs: Quantities & Settings */}
                        <div className="space-y-6">

                            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-4">
                                <h3 className="font-black uppercase tracking-widest text-blue-900 border-b-2 border-blue-200 pb-2">Window Specifications</h3>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">1st Floor Windows (Qty)</Label>
                                    <Input
                                        type="number"
                                        value={qty1st}
                                        onChange={(e) => setQty1st(e.target.value ? Number(e.target.value) : '')}
                                        className="border-2 border-black font-bold text-lg"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">2nd Floor Windows (Qty)</Label>
                                    <Input
                                        type="number"
                                        value={qty2nd}
                                        onChange={(e) => setQty2nd(e.target.value ? Number(e.target.value) : '')}
                                        className="border-2 border-black font-bold text-lg"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">3rd Floor Windows (Qty)</Label>
                                    <Input
                                        type="number"
                                        value={qty3rd}
                                        onChange={(e) => setQty3rd(e.target.value ? Number(e.target.value) : '')}
                                        className="border-2 border-black font-bold text-lg"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2 pt-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Scope of Work</Label>
                                    <select
                                        value={scope}
                                        onChange={(e) => setScope(e.target.value as any)}
                                        className="flex h-10 w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Exterior Only">Exterior Only (1 Side)</option>
                                        <option value="Exterior & Interior">Exterior & Interior (2 Sides)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Condition</Label>
                                    <select
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value as any)}
                                        className="flex h-10 w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Standard Maintenance">Standard Maintenance</option>
                                        <option value="Post-Construction">Post-Construction (x2.0 Labor)</option>
                                    </select>
                                </div>

                                <div className="flex items-center space-x-3 pt-2">
                                    <input
                                        type="checkbox"
                                        id="buffing"
                                        checked={buffing}
                                        onChange={(e) => setBuffing(e.target.checked)}
                                        className="w-5 h-5 border-2 border-black rounded"
                                    />
                                    <Label htmlFor="buffing" className="text-sm font-bold uppercase tracking-wider text-slate-700 cursor-pointer">
                                        Include Detail Buffing (+1 min / side)
                                    </Label>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-lg space-y-4">
                                <h3 className="font-black uppercase tracking-widest text-slate-700 border-b-2 border-slate-200 pb-2">Financial Overrides</h3>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Trip Cost ($)</Label>
                                    <Input
                                        type="number"
                                        value={tripCost}
                                        onChange={(e) => setTripCost(e.target.value ? Number(e.target.value) : '')}
                                        className="border-2 border-black font-bold text-lg"
                                        placeholder="0.00"
                                    />
                                </div>

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
                                <span className="font-bold uppercase tracking-widest text-sm text-gray-400">Labor Cost:</span>
                                <span className="font-black text-xl">${windowVals.laborCost.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between border-b border-gray-700 pb-2 items-end">
                                <span className="font-bold uppercase tracking-widest text-sm text-gray-400">Fixed Trip Cost:</span>
                                <span className="font-black text-xl">${windowVals.tripCost.toFixed(2)}</span>
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

                        {windowVals.totalQty > 0 && (
                            <div className="border-l-4 border-blue-600 pl-6 print:pl-4 print:break-inside-avoid">
                                <h4 className="text-xl print:text-lg font-black uppercase tracking-wider">Professional Window Cleaning</h4>
                                <div className="mt-4 print:mt-2 space-y-1">
                                    <p className="text-slate-600 font-bold text-lg print:text-sm mb-2">Windows Traced by Level:</p>
                                    <ul className="list-disc list-inside text-slate-600 font-bold text-lg print:text-sm pl-2 mb-4">
                                        {Number(qty1st) > 0 && <li>1st Floor: {Number(qty1st).toLocaleString()} panels</li>}
                                        {Number(qty2nd) > 0 && <li>2nd Floor: {Number(qty2nd).toLocaleString()} panels</li>}
                                        {Number(qty3rd) > 0 && <li>3rd Floor: {Number(qty3rd).toLocaleString()} panels</li>}
                                    </ul>
                                    <p className="text-slate-600 font-bold text-lg print:text-sm">• Cleaning Scope: {scope}</p>
                                    <p className="text-slate-600 font-bold text-lg print:text-sm">• Site Condition: {condition}</p>
                                    <p className="text-slate-600 font-bold text-lg print:text-sm">• Detail Buffing: {buffing ? 'Included' : 'Not Included'}</p>
                                </div>
                                <div className="mt-8 print:mt-4 flex justify-between items-end border-b-2 border-slate-200 pb-2 print:pb-1">
                                    <span className="text-sm print:text-xs font-bold uppercase tracking-widest text-slate-500">Project Investment:</span>
                                    <span className="text-3xl print:text-xl font-black">${windowVals.finalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {windowVals.totalQty === 0 && (
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
