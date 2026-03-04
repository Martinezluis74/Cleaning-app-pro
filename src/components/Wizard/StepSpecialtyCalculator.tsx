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
        <div className="flex flex-col space-y-8 w-full max-w-5xl mx-auto p-4">

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
    );
}
