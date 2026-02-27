"use client";

import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepFinancialDashboard() {
    const { state, updateFinancials } = useWizard();
    const { totals, financials, site } = state;

    return (
        <div className="space-y-8 bg-white">
            <div>
                <CardTitle className="text-4xl font-black text-black mb-2 uppercase tracking-tighter">Paso 4: Dashboard Financiero</CardTitle>
                <CardDescription className="text-black font-bold text-lg">
                    Consolidación de tiempos y cierre de la cotización. Ajusta el pago por hora y los márgenes operativos.
                </CardDescription>
            </div>

            {/* Consolidación de Tiempos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-100 border-4 border-black rounded-2xl shadow-sm space-y-2">
                    <Label className="text-black font-black uppercase tracking-widest text-xl">Total Horas por Visita</Label>
                    <div className="text-5xl font-black text-black">{totals.hoursPerVisit} <span className="text-2xl">hrs</span></div>
                    <p className="text-sm font-bold text-slate-700">Calculado desde: Pisos, Escritorios, Basura y Baños.</p>
                </div>
                <div className="p-6 bg-slate-100 border-4 border-black rounded-2xl shadow-sm space-y-2">
                    <Label className="text-black font-black uppercase tracking-widest text-xl">Total Horas Semanales</Label>
                    <div className="text-5xl font-black text-black">{totals.totalHours} <span className="text-2xl">hrs</span></div>
                    <p className="text-sm font-bold text-slate-700">Basado en tu frecuencia de {site.cleaningFrequency || 1}x a la semana.</p>
                </div>
            </div>

            {/* Costo de Labor Directa y Márgenes */}
            <div className="space-y-4">
                <Label className="text-black font-black uppercase tracking-widest text-2xl border-b-4 border-black pb-2 block">
                    Control de Rentabilidad
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white border-4 border-black rounded-2xl shadow-sm">
                    <div className="space-y-3">
                        <Label className="text-black font-black uppercase text-lg block">Pago Empleado ($/hr)</Label>
                        <Input
                            type="number" step="0.50" min="0" placeholder="Ej. 18.00"
                            value={financials.laborRate || 0}
                            onChange={e => updateFinancials({ laborRate: Number(e.target.value) || 0 })}
                            className="bg-white border-2 border-black text-black text-2xl font-black h-14 shadow-sm focus-visible:ring-black"
                        />
                        <p className="text-xs font-bold text-slate-600 bg-slate-100 p-2 border border-slate-300 rounded">
                            Automáticamente aplica el 18.65% de Cargas Prestacionales (Taxes, WSIB, Insurances) en el panel de cálculos.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-black font-black uppercase text-lg block">Gastos Operativos (Overhead)</Label>
                        <Input
                            type="number" step="0.01" min="0" placeholder="Ej. 0.15"
                            value={financials.overheadMargin || 0}
                            onChange={e => updateFinancials({ overheadMargin: Number(e.target.value) || 0 })}
                            className="bg-white border-2 border-black text-black text-2xl font-black h-14 shadow-sm focus-visible:ring-black"
                        />
                        <p className="text-xs font-bold text-slate-600">Representa el {(financials.overheadMargin * 100).toFixed(0)}% del costo laboral base.</p>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-black font-black uppercase text-lg block">Utilidad (Profit)</Label>
                        <Input
                            type="number" step="0.01" min="0" placeholder="Ej. 0.20"
                            value={financials.profitMargin || 0}
                            onChange={e => updateFinancials({ profitMargin: Number(e.target.value) || 0 })}
                            className="bg-white border-2 border-black text-black text-2xl font-black h-14 shadow-sm focus-visible:ring-black"
                        />
                        <p className="text-xs font-bold text-slate-600">Representa el {(financials.profitMargin * 100).toFixed(0)}% previo a impuestos.</p>
                    </div>
                </div>
            </div>

            {/* Resultado Final */}
            <div className="p-8 bg-black text-white rounded-3xl space-y-6 shadow-2xl mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y-4 md:divide-y-0 md:divide-x-4 divide-white">
                    <div className="space-y-2 pt-4 md:pt-0">
                        <Label className="text-white font-black uppercase tracking-widest text-xl">Price per Visit</Label>
                        <div className="text-7xl font-black tracking-tighter">
                            ${(totals.subtotal / (site.cleaningFrequency || 1)).toFixed(2)}
                        </div>
                        <p className="text-sm font-bold text-slate-300">Incluye Mano de Obra, Overhead y Utilidad (sin HST).</p>
                    </div>

                    <div className="space-y-2 md:pl-8 pt-4 md:pt-0">
                        <Label className="text-white font-black uppercase tracking-widest text-xl">Monthly Total</Label>
                        <div className="text-7xl font-black tracking-tighter text-yellow-400">
                            ${(totals.subtotal * 4.33).toFixed(2)}
                        </div>
                        <p className="text-sm font-bold text-slate-300">Proyección mensual (4.33 semanas / mes).</p>
                    </div>
                </div>

                <div className="pt-6 border-t-2 border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="font-bold text-lg uppercase tracking-widest text-slate-400">HST (13%): ${(totals.tax * 4.33).toFixed(2)} /mo</span>
                    <span className="font-black text-2xl md:text-3xl uppercase tracking-widest bg-white text-black px-6 py-4 rounded-xl border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Factura Mensual: ${(totals.finalTotal * 4.33).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
