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
import StepBathroomsProfile from './StepBathroomsProfile';
import StepFinancialDashboard from './StepFinancialDashboard';

export function WalkthroughWizard() {
    const { state, setStep, nextStep, prevStep, updateFinancials } = useWizard();
    const { currentStep, client, totals, areas, pricingModel, financials } = state;

    const progressPercentage = (currentStep / 4) * 100;

    const getStepComponent = () => {
        switch (currentStep) {
            case 1: return <StepClientProfile />;
            case 2: return <StepSiteProfile />;             // Perfil Base (SqFt, Desks, People)
            case 3: return <StepBathroomsProfile />;        // Baños y Basura
            case 4: return <StepFinancialDashboard />;      // Cierre Financiero
            default: return <StepClientProfile />;
        }
    };

    // Calculate fixture impacts for the Sidebar
    const f = state.site.fixtures || { rooms: 0, toilets: 0, urinals: 0, sinks: 0, showers: 0 };
    const totalFixtures = (f.toilets || 0) + (f.urinals || 0) + (f.sinks || 0) + (f.showers || 0);
    const fixtureHours = (((f.toilets || 0) * 3) + ((f.urinals || 0) * 2) + ((f.sinks || 0) * 1) + ((f.showers || 0) * 5)) / 60;
    const fixtureLaborCost = fixtureHours * (state.financials.laborRate + state.financials.remittances) * (state.site.cleaningFrequency || 1);

    const trashTarget = state.site.trashCans || 0;
    const trashLaborCost = ((trashTarget * 1.5) / 60) * (state.financials.laborRate + state.financials.remittances) * (state.site.cleaningFrequency || 1);

    const frequency = state.site.cleaningFrequency || 1;
    const hoursPerVisit = (totals.totalHours / frequency).toFixed(2);

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
                        <span className="text-sm font-bold text-black">Step {currentStep} of 4</span>
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

                        {currentStep < 4 ? (
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
                                <div className="pt-2 mt-2 border-t border-slate-300">
                                    <span className="text-xs text-black uppercase tracking-widest font-black mb-1 block">Inventario Fijo y Recolección</span>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-black uppercase tracking-wide">
                                        <div className="flex justify-between"><span className="font-bold">Escritorios:</span><span className="font-black">{state.site.desks || 0}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Personas:</span><span className="font-black">{state.site.people || 0}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Canecas:</span><span className="font-black">{state.site.trashCans || 0}</span></div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t-2 border-dashed border-slate-300">
                                        <div className="flex justify-between text-[11px] text-black mt-1"><span className="font-bold text-slate-600">Impacto Labor (Recolección):</span><span className="font-black text-blue-800">+${trashLaborCost.toFixed(2)}</span></div>
                                    </div>
                                </div>
                                <div className="pt-2 mt-2 border-t border-slate-300">
                                    <span className="text-xs text-black uppercase tracking-widest font-black mb-1 block">Accesorios</span>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-black uppercase tracking-wide">
                                        <div className="flex justify-between"><span className="font-bold">Rooms/Baños:</span><span className="font-black">{f.rooms || 0}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Toilets:</span><span className="font-black">{f.toilets || 0}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Urinales:</span><span className="font-black">{f.urinals || 0}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Lavamanos:</span><span className="font-black">{f.sinks || 0}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Duchas:</span><span className="font-black">{f.showers || 0}</span></div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t-2 border-dashed border-slate-300">
                                        <div className="flex justify-between text-[11px] text-black"><span className="font-black uppercase">Total Accesorios detectados:</span><span className="font-black bg-black text-white px-1 rounded">{totalFixtures}</span></div>
                                        <div className="flex justify-between text-[11px] text-black mt-1"><span className="font-bold text-slate-600">Impacto en Labor:</span><span className="font-black text-blue-800">+${fixtureLaborCost.toFixed(2)}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-6 space-y-6 bg-white">
                            {/* ALERTS */}
                            {currentStep > 3 && totals.totalHours === 0 && (
                                <div className="bg-slate-100 border-2 border-black rounded-lg p-3 flex gap-3 text-sm text-black shadow-sm font-bold">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <div><span className="font-black uppercase mark bg-yellow-300 px-1">Review:</span> No has ingresado datos productivos (SqFt, Escritorios, o Baños).</div>
                                </div>
                            )}

                            {/* COST BREAKDOWN (Requested feature) */}
                            <div className="bg-white p-4 rounded-xl border-2 border-black shadow-sm space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-2">Desglose Financiero (Mano de Obra)</h4>

                                <div className="flex justify-between text-xs items-center text-black font-bold">
                                    <span>Horas por Visita</span>
                                    <span className="font-black">{hoursPerVisit} hrs</span>
                                </div>

                                <div className="flex justify-between text-xs items-center text-black font-bold border-b border-slate-300 pb-2 mb-2">
                                    <span>Frecuencia Semanal</span>
                                    <span className="font-black">{frequency}x</span>
                                </div>

                                <div className="flex justify-between text-xs items-center text-black font-bold">
                                    <span>Labor & Remit ({totals.totalHours} hrs/sem)</span>
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
                                    <span className="text-sm font-black uppercase tracking-widest text-black">Total Semanal Final</span>
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
