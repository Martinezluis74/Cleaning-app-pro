import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepSpecialtyCalculator() {
    // ---- Strip & Wax State ----
    const [stripSqft, setStripSqft] = useState<number | ''>('');
    const [stripOverhead, setStripOverhead] = useState<number | ''>(0);
    const [stripMarkup, setStripMarkup] = useState<number | ''>(45);

    // ---- Scrub & Wax State ----
    const [scrubSqft, setScrubSqft] = useState<number | ''>('');
    const [scrubOverhead, setScrubOverhead] = useState<number | ''>(0);
    const [scrubMarkup, setScrubMarkup] = useState<number | ''>(45);

    // --- Strip & Wax Calculation ---
    const calculateStrip = () => {
        const sqft = Number(stripSqft) || 0;
        const oh = Number(stripOverhead) || 0;
        const mu = Number(stripMarkup) || 0;

        if (sqft === 0) return { labor: 0, chem: 0, total: 0 };

        let laborRate = 0.272;
        if (sqft > 10000) laborRate = 0.272 * 0.75;
        else if (sqft > 5000) laborRate = 0.272 * 0.80;
        else if (sqft > 2500) laborRate = 0.272 * 0.90;

        const chem = sqft * 0.08;
        const labor = sqft * laborRate;

        const raw = labor + chem;
        const withOh = raw * (1 + (oh / 100));
        let final = withOh / (1 - (mu / 100));

        if (final < 750) final = 750;

        return { labor, chem, total: final };
    };

    // --- Scrub & Wax Calculation ---
    const calculateScrub = () => {
        const sqft = Number(scrubSqft) || 0;
        const oh = Number(scrubOverhead) || 0;
        const mu = Number(scrubMarkup) || 0;

        if (sqft === 0) return { labor: 0, chem: 0, total: 0 };

        const chem = sqft * 0.04;
        const labor = sqft * 0.17;

        const raw = labor + chem; // sqft * 0.21
        const withOh = raw * (1 + (oh / 100));
        let final = withOh / (1 - (mu / 100));

        if (final < 450) final = 450;

        return { labor, chem, total: final };
    };

    const stripVals = calculateStrip();
    const scrubVals = calculateScrub();

    return (
        <div className="w-full">
            {/* SCREEN VIEW */}
            <div className="flex flex-col space-y-8 w-full max-w-5xl mx-auto p-4 print:hidden">

                {/* Header Action Bar */}
                <div className="flex justify-end print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white font-bold py-3 px-6 rounded shadow-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        📄 GENERATE PDF PROPOSAL
                    </button>
                </div>

                {/* CARJET 1: STRIP & WAX */}
                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="bg-slate-100 border-b-4 border-black pb-4">
                        <CardTitle className="text-2xl font-black uppercase tracking-widest text-black">
                            Strip & Wax (PVC)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Inputs */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Area (SqFt)</Label>
                                <Input
                                    type="number"
                                    value={stripSqft}
                                    onChange={(e) => setStripSqft(e.target.value ? Number(e.target.value) : '')}
                                    className="border-2 border-black font-bold text-lg"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Overhead (%)</Label>
                                <Input
                                    type="number"
                                    value={stripOverhead}
                                    onChange={(e) => setStripOverhead(e.target.value ? Number(e.target.value) : '')}
                                    className="border-2 border-black font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Markup (%)</Label>
                                <Input
                                    type="number"
                                    value={stripMarkup}
                                    onChange={(e) => setStripMarkup(e.target.value ? Number(e.target.value) : '')}
                                    className="border-2 border-black font-bold text-lg"
                                />
                            </div>
                        </div>

                        {/* Outputs */}
                        <div className="bg-black text-white p-6 rounded-xl flex flex-col justify-center space-y-4">
                            <div className="flex justify-between border-b border-gray-700 pb-2">
                                <span className="font-bold uppercase tracking-widest text-sm text-gray-400">Labor Cost:</span>
                                <span className="font-black">${stripVals.labor.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-700 pb-2">
                                <span className="font-bold uppercase tracking-widest text-sm text-gray-400">Chemicals Cost:</span>
                                <span className="font-black">${stripVals.chem.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-4">
                                <span className="font-black uppercase tracking-widest text-lg text-green-400">Final Project Price:</span>
                                <span className="font-black text-3xl text-white">${stripVals.total.toFixed(2)}</span>
                            </div>
                            {stripVals.total === 750 && stripSqft !== '' && Number(stripSqft) > 0 && (
                                <div className="text-xs font-bold text-red-400 uppercase tracking-widest text-right mt-2">
                                    (Minimum Floor $750 Applied)
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* CARJET 2: SCRUB & WAX */}
                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="bg-slate-100 border-b-4 border-black pb-4">
                        <CardTitle className="text-2xl font-black uppercase tracking-widest text-black">
                            Scrub & Wax (Top Scrub & 3 Coats)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Inputs */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Area (SqFt)</Label>
                                <Input
                                    type="number"
                                    value={scrubSqft}
                                    onChange={(e) => setScrubSqft(e.target.value ? Number(e.target.value) : '')}
                                    className="border-2 border-black font-bold text-lg"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Overhead (%)</Label>
                                <Input
                                    type="number"
                                    value={scrubOverhead}
                                    onChange={(e) => setScrubOverhead(e.target.value ? Number(e.target.value) : '')}
                                    className="border-2 border-black font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold uppercase tracking-wider text-slate-700">Markup (%)</Label>
                                <Input
                                    type="number"
                                    value={scrubMarkup}
                                    onChange={(e) => setScrubMarkup(e.target.value ? Number(e.target.value) : '')}
                                    className="border-2 border-black font-bold text-lg"
                                />
                            </div>
                        </div>

                        {/* Outputs */}
                        <div className="bg-black text-white p-6 rounded-xl flex flex-col justify-center space-y-4">
                            <div className="flex justify-between border-b border-gray-700 pb-2">
                                <span className="font-bold uppercase tracking-widest text-sm text-gray-400">Labor Cost:</span>
                                <span className="font-black">${scrubVals.labor.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-700 pb-2">
                                <span className="font-bold uppercase tracking-widest text-sm text-gray-400">Chemicals Cost:</span>
                                <span className="font-black">${scrubVals.chem.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-4">
                                <span className="font-black uppercase tracking-widest text-lg text-green-400">Final Project Price:</span>
                                <span className="font-black text-3xl text-white">${scrubVals.total.toFixed(2)}</span>
                            </div>
                            {scrubVals.total === 450 && scrubSqft !== '' && Number(scrubSqft) > 0 && (
                                <div className="text-xs font-bold text-red-400 uppercase tracking-widest text-right mt-2">
                                    (Minimum Floor $450 Applied)
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* PRINT INVOICE VIEW */}
            <div className="hidden print:block w-full max-w-[8.5in] mx-auto bg-white text-black font-sans py-10 px-8">
                {/* Header */}
                <div className="border-b-4 border-black pb-6 mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-widest text-blue-900">Blue Gloves Cleaning</h1>
                        <h2 className="text-2xl font-bold uppercase tracking-wider mt-2">Service Proposal</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Date</p>
                        <p className="text-black font-black text-lg">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Scope of Work */}
                <div className="mb-16 min-h-[400px]">
                    <h3 className="text-xl font-black uppercase tracking-widest bg-black text-white p-3 mb-6">Scope of Work</h3>
                    <div className="space-y-10">

                        {Number(stripSqft) > 0 && (
                            <div className="border-l-4 border-blue-600 pl-6">
                                <h4 className="text-xl font-black uppercase tracking-wider">Floor Restoration: Strip & Wax (PVC)</h4>
                                <p className="text-slate-600 font-bold mt-2 text-lg">Total Area: {Number(stripSqft).toLocaleString()} SqFt</p>
                                <div className="mt-6 flex justify-between items-end border-b-2 border-slate-200 pb-2">
                                    <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Project Investment:</span>
                                    <span className="text-3xl font-black">${stripVals.total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {Number(scrubSqft) > 0 && (
                            <div className="border-l-4 border-blue-600 pl-6 pt-4">
                                <h4 className="text-xl font-black uppercase tracking-wider">Floor Restoration: Scrub & Wax (Top Scrub & 3 Coats)</h4>
                                <p className="text-slate-600 font-bold mt-2 text-lg">Total Area: {Number(scrubSqft).toLocaleString()} SqFt</p>
                                <div className="mt-6 flex justify-between items-end border-b-2 border-slate-200 pb-2">
                                    <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Project Investment:</span>
                                    <span className="text-3xl font-black">${scrubVals.total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {(Number(stripSqft) === 0 && Number(scrubSqft) === 0) && (
                            <p className="text-slate-500 italic text-lg text-center py-10 border-2 border-dashed border-slate-300">
                                No specialty services selected.
                            </p>
                        )}
                    </div>
                </div>

                {/* Signatures */}
                <div className="mt-auto pt-10 border-t-2 border-slate-300 grid grid-cols-2 gap-16">
                    <div>
                        <p className="font-bold uppercase tracking-widest text-sm text-slate-500 mb-12">Accepted by Blue Gloves Cleaning</p>
                        <div className="border-b-2 border-black w-full"></div>
                        <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-wider">Authorized Signature</p>
                    </div>
                    <div>
                        <p className="font-bold uppercase tracking-widest text-sm text-slate-500 mb-12">Client Acceptance</p>
                        <div className="border-b-2 border-black w-full"></div>
                        <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-wider">Client Signature & Date</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
