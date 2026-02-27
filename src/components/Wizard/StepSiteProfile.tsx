"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StepSiteProfile() {
    const { state, updateSite } = useWizard();

    const totalSqft = Number(state.site.sqft) || 0;

    const handleFloorChange = (index: number, field: string, value: any) => {
        const newMatrix = [...(state.site.floorMatrix || [])];
        newMatrix[index] = { ...newMatrix[index], [field]: value };
        updateSite({ floorMatrix: newMatrix });
    };

    return (
        <div className="space-y-8">
            <div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Paso 2: Auditoría de Suelos</CardTitle>
                <CardDescription className="text-slate-500">
                    Ingresa los datos exactos del edificio. El cálculo de horas se basará en el Total SqFt y la Clase.
                </CardDescription>
            </div>

            <div className="space-y-8">
                {/* BUILDING CLASS & FREQUENCY & TSQFT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs">Total SqFt del Edificio</Label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="Ej. 5000"
                            value={state.site.sqft || ''}
                            onChange={e => updateSite({ sqft: Number(e.target.value) })}
                            className="bg-white border-blue-300 text-blue-900 text-lg font-black h-12 shadow-sm focus-visible:ring-blue-500"
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

                    <div className="space-y-3">
                        <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs">Frecuencia Semanal</Label>
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

                {/* FLOOR MATRIX (2x3) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs text-blue-600">
                            Desglose de Áreas (Pisos)
                        </Label>
                        <div className="text-right">
                            <span className="text-xs text-slate-500 font-bold uppercase">Total Edificio</span>
                            <div className="text-xl font-black text-slate-900">{totalSqft.toLocaleString()} SqFt</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {state.site.floorMatrix?.map((floor, index) => {
                            const pct = totalSqft > 0 && floor.sqft ? ((floor.sqft / totalSqft) * 100).toFixed(1) : "0.0";
                            return (
                                <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-slate-400">Área {index + 1}</span>
                                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">{pct}%</span>
                                    </div>
                                    <Select value={floor.floorType} onValueChange={v => handleFloorChange(index, 'floorType', v)}>
                                        <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-800 h-10">
                                            <SelectValue placeholder="Tipo de Piso" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                                            <SelectItem value="Carpet">Carpet</SelectItem>
                                            <SelectItem value="VCT">VCT</SelectItem>
                                            <SelectItem value="Ceramic Tile">Ceramic Tile</SelectItem>
                                            <SelectItem value="Concrete">Concrete</SelectItem>
                                            <SelectItem value="Hardwood">Hardwood</SelectItem>
                                            <SelectItem value="">Sin Asignar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="relative">
                                        <Input
                                            type="number" min="0" placeholder="0"
                                            value={floor.sqft || ''}
                                            onChange={e => handleFloorChange(index, 'sqft', Number(e.target.value))}
                                            className="pl-4 pr-16 h-10 font-bold text-slate-900 bg-slate-50"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">SqFt</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>



            </div>
        </div>
    );
}
