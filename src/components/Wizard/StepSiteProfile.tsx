"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StepSiteProfile() {
    const { state, updateSite } = useWizard();
    return (
        <div className="space-y-8">
            <div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Paso 2: Levantamiento Técnico</CardTitle>
                <CardDescription className="text-slate-500">
                    Ingresa los datos exactos del edificio. El cálculo se realizará sobre estas medidas.
                </CardDescription>
            </div>

            <div className="space-y-8">
                {/* SQFT & BUILDING CLASS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs">Total SqFt del Edificio</Label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="Ej. 5000"
                            value={state.site.sqft || ''}
                            onChange={e => updateSite({ sqft: Number(e.target.value) })}
                            className="bg-white border-slate-300 text-slate-900 text-lg font-bold h-12 shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs">Clase (Tasa de Producción)</Label>
                        <Select value={state.site.buildingClass} onValueChange={(v: any) => updateSite({ buildingClass: v })}>
                            <SelectTrigger className="bg-white border-slate-300 text-slate-900 h-12 font-medium">
                                <SelectValue placeholder="Seleccione Clase" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900">
                                <SelectItem value="A">Clase A (Alto tránsito - 2000 sqft/hr)</SelectItem>
                                <SelectItem value="B">Clase B (Estándar médico/oficina - 2500 sqft/hr)</SelectItem>
                                <SelectItem value="C">Clase C (Industrial/Básico - 3000 sqft/hr)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* FLOOR TYPE & FREQUENCY */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs">Tipo de Piso Predominante</Label>
                        <Select value={state.site.floorType || 'Carpet'} onValueChange={v => updateSite({ floorType: v })}>
                            <SelectTrigger className="bg-white border-slate-300 text-slate-900 shadow-sm w-[300px]">
                                <SelectValue placeholder="Seleccione Tipo de Piso" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900">
                                <SelectItem value="Carpet">Carpet (Alfombra)</SelectItem>
                                <SelectItem value="VCT">VCT (Vinilo)</SelectItem>
                                <SelectItem value="Ceramic">Ceramic Tile</SelectItem>
                                <SelectItem value="Concrete">Concrete (Concreto)</SelectItem>
                                <SelectItem value="Hardwood">Hardwood (Madera)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs">Frecuencia Semanal (Días por Semana)</Label>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                <button
                                    key={num}
                                    onClick={() => updateSite({ cleaningFrequency: num })}
                                    className={`w-12 h-12 rounded-full font-black text-lg transition-all ${state.site.cleaningFrequency === num
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                            : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    {num}x
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FIXTURE COUNTERS (BATHROOMS) */}
                <div className="space-y-3">
                    <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs text-blue-600">Accesorios (Baños & Cocinas)</Label>
                    <div className="grid grid-cols-3 gap-4 p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-slate-500">Toilets / Inodoros</Label>
                            <Input
                                type="number" min="0"
                                value={state.site.fixtures?.toilets || 0}
                                onChange={e => updateSite({ fixtures: { ...(state.site.fixtures || { toilets: 0, urinals: 0, sinks: 0 }), toilets: Number(e.target.value) } })}
                                className="h-12 text-center text-xl bg-white border-white shadow-sm font-black text-blue-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-slate-500">Urinals / Orinales</Label>
                            <Input
                                type="number" min="0"
                                value={state.site.fixtures?.urinals || 0}
                                onChange={e => updateSite({ fixtures: { ...(state.site.fixtures || { toilets: 0, urinals: 0, sinks: 0 }), urinals: Number(e.target.value) } })}
                                className="h-12 text-center text-xl bg-white border-white shadow-sm font-black text-blue-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-slate-500">Sinks / Lavamanos</Label>
                            <Input
                                type="number" min="0"
                                value={state.site.fixtures?.sinks || 0}
                                onChange={e => updateSite({ fixtures: { ...(state.site.fixtures || { toilets: 0, urinals: 0, sinks: 0 }), sinks: Number(e.target.value) } })}
                                className="h-12 text-center text-xl bg-white border-white shadow-sm font-black text-blue-900"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
