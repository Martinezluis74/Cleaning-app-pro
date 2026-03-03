import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepSpecialtyCalculator() {
    const [sqft, setSqft] = useState<number | ''>('');
    const [overhead, setOverhead] = useState<number | ''>(0);
    const [markup, setMarkup] = useState<number | ''>(45);

    const calculations = useMemo(() => {
        const parsedSqft = typeof sqft === 'number' ? sqft : 0;
        const parsedOverhead = typeof overhead === 'number' ? overhead : 0;
        const parsedMarkup = typeof markup === 'number' ? markup : 0;

        if (parsedSqft === 0) {
            return { rawLabor: 0, rawChemical: 0, subtotalRaw: 0, totalWithOverhead: 0, finalPrice: 0, isMinimumForced: false, effectiveLaborRate: 0 };
        }

        const baseChemicalRate = 0.08;
        let effectiveLaborRate = 0.272;

        if (parsedSqft > 10000) {
            effectiveLaborRate = 0.272 * 0.75;
        } else if (parsedSqft > 5000) {
            effectiveLaborRate = 0.272 * 0.80;
        } else if (parsedSqft > 2500) {
            effectiveLaborRate = 0.272 * 0.90;
        }

        const rawLabor = parsedSqft * effectiveLaborRate;
        const rawChemical = parsedSqft * baseChemicalRate;
        const subtotalRaw = rawLabor + rawChemical;
        const totalWithOverhead = subtotalRaw * (1 + (parsedOverhead / 100));
        let finalPrice = totalWithOverhead / (1 - (parsedMarkup / 100));

        // Anti-dumping minimum rule
        let isMinimumForced = false;
        if (finalPrice < 750) {
            finalPrice = 750;
            isMinimumForced = true;
        }

        return { rawLabor, rawChemical, subtotalRaw, totalWithOverhead, finalPrice, isMinimumForced, effectiveLaborRate };
    }, [sqft, overhead, markup]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-6xl mx-auto">
            {/* Input Form */}
            <div className="lg:col-span-8 flex flex-col space-y-6">
                <Card className="border-2 border-black shadow-lg">
                    <CardHeader className="border-b-2 border-black bg-slate-50">
                        <CardTitle className="text-xl font-black uppercase tracking-wider text-black">
                            Floor Care: Strip & Wax
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-black uppercase tracking-widest">
                                    Total Area (SqFt)
                                </Label>
                                <Input
                                    type="number"
                                    value={sqft}
                                    onChange={(e) => setSqft(e.target.value ? Number(e.target.value) : '')}
                                    placeholder="e.g. 3500"
                                    className="border-2 border-black text-lg font-bold placeholder:text-slate-300"
                                    min="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-black uppercase tracking-widest flex items-center gap-2">
                                    Overhead Target <span className="text-xs text-slate-400 font-normal">%</span>
                                </Label>
                                <Input
                                    type="number"
                                    value={overhead}
                                    onChange={(e) => setOverhead(e.target.value ? Number(e.target.value) : '')}
                                    className="border-2 border-black text-lg font-bold"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-black uppercase tracking-widest flex items-center gap-2">
                                    Markup Margin <span className="text-xs text-slate-400 font-normal">%</span>
                                </Label>
                                <Input
                                    type="number"
                                    value={markup}
                                    onChange={(e) => setMarkup(e.target.value ? Number(e.target.value) : '')}
                                    className="border-2 border-black text-lg font-bold"
                                    min="0"
                                    max="99"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl">
                            <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-2">Tier Efficiency Active</h4>
                            <p className="text-sm text-blue-800 font-bold">
                                Current Labor Variable: ${calculations.effectiveLaborRate.toFixed(3)} / SqFt
                                {calculations.effectiveLaborRate < 0.272 && (
                                    <span className="ml-2 text-green-600 font-black px-2 py-0.5 bg-green-100 rounded-md border border-green-200 text-xs">
                                        Volume Discount Engaged
                                    </span>
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Financial Sidebar Mini-Panel */}
            <div className="lg:col-span-4 space-y-4">
                <Card className="sticky top-28 bg-white border-2 border-black shadow-2xl rounded-2xl overflow-hidden">
                    <div className="bg-black text-white p-4">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                            Project Financials
                        </h3>
                    </div>

                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm items-center text-slate-500 font-bold">
                                <span>Raw Labor Base</span>
                                <span>${calculations.rawLabor.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm items-center text-slate-500 font-bold">
                                <span>Chemical Baseline ($0.08)</span>
                                <span>${calculations.rawChemical.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm items-center text-black font-black pt-2 border-t-2 border-black">
                                <span>Subtotal Raw Cost</span>
                                <span>${calculations.subtotalRaw.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-sm items-center text-slate-500 font-bold mt-2">
                                <span>Overhead Apportion ({overhead || 0}%)</span>
                                <span>${(calculations.totalWithOverhead - calculations.subtotalRaw).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-sm items-center text-green-700 font-black bg-green-50 p-2 rounded border-2 border-green-200 mt-2">
                                <span>Gross Profit Markup ({markup || 0}%)</span>
                                <span>${(calculations.finalPrice - calculations.totalWithOverhead).toFixed(2)}</span>
                            </div>

                            {calculations.isMinimumForced && (
                                <div className="mt-2 bg-red-100 border border-red-300 rounded p-2 text-center animate-pulse">
                                    <span className="text-red-700 font-black text-xs uppercase tracking-wider">
                                        Minimum Project Floor ($750) Engaged
                                    </span>
                                </div>
                            )}

                            <div className="pt-4 mt-4 border-t-2 border-dashed border-slate-300 flex justify-between items-end">
                                <span className="text-sm font-black uppercase tracking-widest text-black">Final Price</span>
                                <span className="text-3xl font-black text-black tracking-tighter">
                                    ${calculations.finalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
