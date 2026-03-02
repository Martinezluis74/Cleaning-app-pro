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
    const showers = state.site.fixtures?.showers || 0;
    const restrooms = state.site.restrooms || [];

    let totalRestrooms = state.site.fixtures?.rooms || 0;
    let totalToilets = state.site.fixtures?.toilets || 0;
    let totalUrinals = state.site.fixtures?.urinals || 0;
    let totalSinks = state.site.fixtures?.sinks || 0;
    let fixtureMins = 0;

    if (restrooms.length > 0) {
        totalRestrooms = restrooms.length;
        totalToilets = 0; totalUrinals = 0; totalSinks = 0;
        restrooms.forEach(r => {
            const t = Number(r.toilets) || 0;
            const u = Number(r.urinals) || 0;
            const s = Number(r.sinks) || 0;
            totalToilets += t; totalUrinals += u; totalSinks += s;

            let rMins = (t * 3) + (u * 2) + (s * 1);
            if (r.trafficLevel === 'Medium') rMins *= 1.15;
            else if (r.trafficLevel === 'High') rMins *= 1.30;
            if (r.restockingOnly) rMins *= 0.20;
            fixtureMins += rMins;
        });
        fixtureMins += (showers * 10);
    } else {
        fixtureMins = (totalToilets * 3) + (totalUrinals * 2) + (totalSinks * 1) + (showers * 10);
    }

    const totalFixtures = totalToilets + totalUrinals + totalSinks + showers;
    const fixtureHours = fixtureMins / 60;
    const baseLaborRate = (state.financials.hourlyPayRate || 18.0) * (state.site.cleaningFrequency || 1);
    const fixtureLaborCost = fixtureHours * baseLaborRate;

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
                                        <div className="flex justify-between"><span className="font-bold">Restrooms:</span><span className="font-black">{totalRestrooms}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Toilets:</span><span className="font-black">{totalToilets}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Urinales:</span><span className="font-black">{totalUrinals}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Lavamanos:</span><span className="font-black">{totalSinks}</span></div>
                                        <div className="flex justify-between"><span className="font-bold">Duchas:</span><span className="font-black">{showers}</span></div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t-2 border-dashed border-slate-300">
                                        <div className="flex justify-between text-[11px] text-black"><span className="font-black uppercase">Total Accesorios detectados:</span><span className="font-black bg-black text-white px-1 rounded">{totalFixtures}</span></div>
                                        <div className="flex justify-between text-[11px] text-black mt-1"><span className="font-bold text-slate-600">Bathrooms Labor:</span><span className="font-black">{fixtureHours.toFixed(2)} hrs</span></div>
                                        <div className="flex justify-between text-[11px] text-black mt-1"><span className="font-bold text-slate-600">Labor Cost (Internal):</span><span className="font-black text-blue-800">+${fixtureLaborCost.toFixed(2)}</span></div>
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

                            {totals.subtotal < totals.actualCost && totals.actualCost > 0 && (
                                <div className="bg-red-600 border-4 border-red-900 rounded-lg p-4 flex gap-3 text-sm text-white shadow-lg font-bold animate-pulse">
                                    <AlertCircle className="w-6 h-6 flex-shrink-0 text-white" />
                                    <div><span className="font-black uppercase bg-white text-red-800 px-1 border border-red-900">LOW MARGIN ALERT:</span><br /> El Precio de Venta (${Number(totals.subtotal).toFixed(2)}) cayó por debajo del Total Labor Cost (${Number(totals.actualCost).toFixed(2)}). Estás operando en pérdida.</div>
                                </div>
                            )}

                            {/* COST BREAKDOWN (Requested feature) */}
                            <div className="bg-white p-4 rounded-xl border-2 border-black shadow-sm space-y-3">
                                <h4 className="text-sm font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-2">Desglose Financiero</h4>

                                <div className="flex justify-between text-[11px] items-center text-slate-500 font-bold">
                                    <span>Real Labor Time</span>
                                    <span>{Number(totals.calculatedHoursPerVisit).toFixed(2)} hrs</span>
                                </div>
                                <div className="flex justify-between text-xs items-center text-black font-bold">
                                    <span>Billable Time (Min 3.0h)</span>
                                    <span className="font-black border-2 border-black px-1 bg-slate-50">{Number(hoursPerVisit).toFixed(2)} hrs</span>
                                </div>

                                <div className="flex justify-between text-xs items-center text-black font-bold border-t border-slate-300 pt-2 mt-2">
                                    <span>Hourly Pay Rate ($)</span>
                                    <Input
                                        type="number" min="0" step="0.5"
                                        placeholder="18.00"
                                        value={financials.hourlyPayRate || ''}
                                        onChange={e => updateFinancials({ hourlyPayRate: Number(e.target.value) || 0 })}
                                        className="w-20 h-8 text-right font-black border-2 border-black text-xs p-1"
                                    />
                                </div>

                                <div className="flex justify-between text-sm items-center text-black font-black bg-slate-100 p-2 rounded border border-slate-300 mt-2">
                                    <span>Total Labor Cost</span>
                                    <span>${Number(totals.actualCost).toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-xs items-center text-black font-bold border-t border-slate-300 pt-2 mt-2">
                                    <span>Price Before Discount</span>
                                    <span className="font-black">${(Number(totals.subtotal) + Number(totals.discountAmount)).toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-xs items-center text-black font-bold mt-2">
                                    <span>Apply Discount (%)</span>
                                    <Input
                                        type="number" min="0" max="100"
                                        placeholder="0"
                                        value={financials.discountPercentage || ''}
                                        onChange={e => updateFinancials({ discountPercentage: Number(e.target.value) || 0 })}
                                        className="w-16 h-8 text-right font-black border-2 border-black text-xs p-1"
                                    />
                                </div>
                                {Number(totals.discountAmount) > 0 && (
                                    <div className="flex justify-between text-[11px] items-center text-red-600 font-bold mb-2">
                                        <span className="flex-1 text-right pr-2">Discount Applied:</span>
                                        <span className="font-black">-${Number(totals.discountAmount).toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm items-center text-black font-black border-t-2 border-black pt-2 mt-2">
                                    <span>Subtotal (Revenue)</span>
                                    <span className="text-lg">${Number(totals.subtotal).toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-sm items-center text-green-700 font-black bg-green-50 p-2 rounded border-2 border-green-200 mt-2">
                                    <span>Gross Profit</span>
                                    <span>${Number(totals.grossProfit).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] items-center text-green-800 font-bold mt-1 px-2 mb-2">
                                    <span>Margin %</span>
                                    <span className="font-black bg-white px-1 border border-green-200">{Number(totals.marginPercentage).toFixed(2)}%</span>
                                </div>

                                <div className="bg-slate-50 border-2 border-black rounded-lg p-3 mt-4 space-y-1 relative overflow-hidden">
                                    <div className="flex justify-between text-base items-center text-black font-black">
                                        <span>Monthly Total</span>
                                        <span className="text-xl">${Number(totals.monthlySubtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                            {state.site.cleaningFrequency || 1} vis/week × 4.33 wks
                                        </span>
                                        {totals.volumeDiscountApplied && (
                                            <span className="text-[10px] text-green-600 font-black uppercase tracking-wider text-right">
                                                (10% Volume Discount Applied)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {Number(totals.oneTimeServicesPrice) > 0 && (
                                    <>
                                        <div className="flex justify-between text-[11px] items-center text-slate-700 font-bold mt-3 px-2">
                                            <span>One-Time Services</span>
                                            <span className="font-black">+${Number(totals.oneTimeServicesPrice).toFixed(2)}</span>
                                        </div>
                                        <div className="bg-black text-white border-2 border-black rounded-lg p-3 mt-2 space-y-1">
                                            <div className="flex justify-between text-base items-center font-black">
                                                <span className="uppercase tracking-widest text-xs">Total First Month</span>
                                                <span className="text-xl">${Number(totals.totalFirstMonth).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-between text-xs items-center text-black font-bold mt-4">
                                    <span>HST (13%)</span>
                                    <span className="font-black">${Number(totals.tax).toFixed(2)}</span>
                                </div>

                                <div className="pt-3 mt-3 border-t-2 border-black flex justify-between items-end">
                                    <span className="text-sm font-black uppercase tracking-widest text-black">Total Semanal Final</span>
                                    <span className="text-3xl font-black text-black tracking-tighter">${Number(totals.finalTotal).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
