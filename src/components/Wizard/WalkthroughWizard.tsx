"use client";

import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import StepClientProfile from './StepClientProfile';
import StepSiteProfile from './StepSiteProfile';
import StepFloorMix from './StepFloorMix';
import StepBathroomsProfile from './StepBathroomsProfile';
import StepAreaManagement from './StepAreaManagement';
import StepScope from './StepScope';
import StepSpecials from './StepSpecials';
import StepCompliance from './StepCompliance';
import StepEvidence from './StepEvidence';

export function WalkthroughWizard() {
    const { state, setStep, nextStep, prevStep, updateFinancials } = useWizard();
    const { currentStep, client, totals, areas, pricingModel, financials } = state;

    const progressPercentage = (currentStep / 10) * 100;

    const getStepComponent = () => {
        switch (currentStep) {
            case 1: return <StepClientProfile />;
            case 2: return <StepSiteProfile />;             // Perfil Base (Total SqFt)
            case 3: return <StepFloorMix />;                // Mix de Pisos
            case 4: return <StepBathroomsProfile />;        // Baños y Accesorios
            case 5:
            case 6: return <StepAreaManagement stepNum={currentStep} />;
            case 7: return <StepScope />;
            case 8: return <StepSpecials />;
            case 9: return <StepCompliance />;
            case 10: return <StepEvidence />;
            default: return <StepClientProfile />;
        }
    };

    const handleSaveQuote = async () => {
        // Here we'd map state to the DB. Since the instructions say "send everything to Neon to not lose it",
        // we make an API call (to be implemented) that saves the WizardState.
        try {
            alert("Enviando y guardando datos a Neon...");
            const res = await fetch('/api/quote/save', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(state)
            });
            if (res.ok) alert("Cotización Guardada Exitosamente!");
        } catch (e) {
            console.error(e);
            alert("Error al guardar.");
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col min-h-screen bg-white text-black">
            {/* 1. FIXED HEADER */}
            <div className="sticky top-0 z-50 bg-white border-b-2 border-black px-6 py-4 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-black">
                            {client.company ? `${client.company} - Walkthrough` : "New Client Walkthrough"}
                        </h2>
                        <span className="text-xs font-bold uppercase tracking-widest bg-slate-200 text-black px-2 py-1 border border-black rounded-md mt-1 inline-block">
                            Draft Status
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-black">Step {currentStep} of 10</span>
                        <div className="w-32 h-2 bg-slate-200 border border-black rounded-full overflow-hidden">
                            <div className="h-full bg-black transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 flex-grow">

                {/* LEFT: STEP CONTENT */}
                <div className="lg:col-span-8 flex flex-col space-y-6">
                    <div className="flex-grow bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
                        {!pricingModel && (
                            <div className="mb-4 text-xs font-bold text-blue-700 bg-blue-50 p-3 rounded-lg flex items-center gap-2 border border-blue-100">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Syncing Pricing from Database...
                            </div>
                        )}
                        {getStepComponent()}
                    </div>

                    {/* NAVIGATION CONTROLS */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border-2 border-black shadow-sm">
                        <Button
                            variant="outline"
                            disabled={currentStep === 1}
                            onClick={prevStep}
                            className="bg-white border-2 border-black text-black font-bold hover:bg-slate-100"
                        >
                            Volver Atrás
                        </Button>

                        {currentStep < 10 ? (
                            <Button
                                onClick={nextStep}
                                className="bg-black hover:bg-slate-800 text-white font-bold border-2 border-black shadow-lg"
                            >
                                Continuar al Paso {currentStep + 1}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSaveQuote}
                                className="bg-white hover:bg-slate-100 text-black font-black border-2 border-black shadow-lg"
                            >
                                <Save className="w-4 h-4 mr-2" /> Confirmar y Guardar
                            </Button>
                        )}
                    </div>
                </div>

                {/* RIGHT: SUMMARY SIDEBAR */}
                <div className="lg:col-span-4 space-y-4">
                    <Card className="sticky top-28 bg-white border-2 border-black shadow-2xl rounded-2xl overflow-hidden">
                        <div className="bg-white text-black p-6 relative overflow-hidden border-b-2 border-black">
                            <h3 className="text-xs font-black uppercase tracking-widest text-black mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-black rounded-full"></span> Resumen Dinámico
                            </h3>
                            <div className="flex flex-col gap-2 text-sm font-medium">
                                <div className="flex justify-between border-b border-slate-300 pb-1">
                                    <span className="font-bold">Total SqFt:</span>
                                    <span className="font-black text-black tracking-widest">{totals.totalSqft.toLocaleString('en-US')}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs text-slate-600 uppercase tracking-widest font-bold mb-1 block">Mix de Pisos</span>
                                    {state.site.floorMatrix?.filter(f => f.sqft > 0 && f.floorType).map((f, i) => (
                                        <div key={i} className="flex justify-between text-xs py-0.5 text-black">
                                            <span className="font-bold">{f.floorType}</span>
                                            <span className="font-black">{Number(f.sqft).toLocaleString('en-US')}</span>
                                        </div>
                                    ))}
                                    {(!state.site.floorMatrix || state.site.floorMatrix.every(f => !f.sqft || !f.floorType)) && (
                                        <div className="text-xs italic text-slate-500 font-bold">Vacío o Incompleto</div>
                                    )}
                                </div>
                                <div className="pt-1 mt-1 border-t border-slate-300">
                                    <span className="text-xs text-slate-600 uppercase tracking-widest font-bold mb-1 block">Accesorios</span>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-black uppercase tracking-wide">
                                        <div className="flex justify-between"><span className="font-bold">Rooms/Baños:</span><span className="font-black">{state.site.fixtures?.rooms || 0}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Toilets:</span><span className="font-black">{state.site.fixtures?.toilets || 0}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Urinales:</span><span className="font-black">{state.site.fixtures?.urinals || 0}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Lavamanos:</span><span className="font-black">{state.site.fixtures?.sinks || 0}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Duchas:</span><span className="font-black">{state.site.fixtures?.showers || 0}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-6 space-y-6 bg-white">
                            {/* ALERTS */}
                            {areas.length === 0 && currentStep > 3 && (
                                <div className="bg-slate-100 border-2 border-black rounded-lg p-3 flex gap-3 text-sm text-black shadow-sm font-bold">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <div><span className="font-black uppercase mark bg-yellow-300 px-1">Review:</span> No has agregado áreas limpiables.</div>
                                </div>
                            )}

                            {/* ADJUSTABLE FINANCIALS */}
                            <div className="bg-white p-4 rounded-xl border-2 border-black shadow-sm space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-2">Variables Financieras</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-black">Labor Rate ($/hr)</Label>
                                        <Input type="number" step="0.01" value={financials.laborRate} onChange={e => updateFinancials({ laborRate: Number(e.target.value) })} className="h-8 text-sm bg-white border-2 border-black text-black font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-black">Remittances ($/hr)</Label>
                                        <Input type="number" step="0.01" value={financials.remittances} onChange={e => updateFinancials({ remittances: Number(e.target.value) })} className="h-8 text-sm bg-white border-2 border-black text-black font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-black">Overhead (%)</Label>
                                        <Input type="number" step="0.01" value={financials.overheadMargin} onChange={e => updateFinancials({ overheadMargin: Number(e.target.value) })} className="h-8 text-sm bg-white border-2 border-black text-black font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-black">Profit (%)</Label>
                                        <Input type="number" step="0.01" value={financials.profitMargin} onChange={e => updateFinancials({ profitMargin: Number(e.target.value) })} className="h-8 text-sm bg-white border-2 border-black text-black font-bold" />
                                    </div>
                                </div>
                            </div>

                            {/* COST BREAKDOWN (Requested feature) */}
                            <div className="bg-white p-4 rounded-xl border-2 border-black shadow-sm space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-2">Desglose Financiero</h4>

                                <div className="flex justify-between text-xs items-center text-black font-bold">
                                    <span>Labor & Remit ({totals.totalHours} hrs)</span>
                                    <span className="font-black">${totals.baseCost.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-xs items-center text-black font-bold">
                                    <span>+ Overhead ({(financials.overheadMargin * 100).toFixed(0)}%)</span>
                                    <span className="font-black">${totals.costWithOverhead.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-sm items-center text-black font-black border-t-2 border-black pt-2 mt-2">
                                    <span>+ Profit ({(financials.profitMargin * 100).toFixed(0)}%) = Subtotal</span>
                                    <span className="text-lg">${totals.subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-xs items-center text-black font-bold">
                                    <span>HST (13%)</span>
                                    <span className="font-black">${totals.tax.toFixed(2)}</span>
                                </div>

                                <div className="pt-3 mt-3 border-t-2 border-black flex justify-between items-end">
                                    <span className="text-sm font-black uppercase tracking-widest text-black">Total Final</span>
                                    <span className="text-3xl font-black text-black tracking-tighter">${totals.finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
