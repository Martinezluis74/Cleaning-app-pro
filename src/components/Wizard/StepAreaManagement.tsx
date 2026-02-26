"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Trash2 } from 'lucide-react';
import type { Area } from '@/types/wizard';

export default function StepAreaManagement({ stepNum }: { stepNum: number }) {
    const { state, addArea, updateArea, duplicateArea, removeArea } = useWizard();

    const handleAddArea = () => {
        const newArea: Area = {
            id: crypto.randomUUID(),
            name: 'Nueva Área',
            sqft: 1000,
            floorType: 'Carpet',
            fixtures: { toilets: 0, urinals: 0, sinks: 0 }
        };
        addArea(newArea);
    };

    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                    {stepNum === 3 ? 'Paso 3: Áreas Principales' : 'Paso 4: Inventario por Área'}
                </CardTitle>
                <CardDescription className="text-slate-500">
                    Añade zonas, especifica metros cuadrados, tipo de piso y cuenta exacta de accesorios.
                </CardDescription>
            </div>

            <div className="space-y-6">
                {state.areas.map((area, index) => (
                    <div key={area.id} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <Input
                                value={area.name}
                                onChange={e => updateArea(area.id, { name: e.target.value })}
                                className="font-bold text-lg text-slate-900 border-0 shadow-none focus-visible:ring-0 p-0 h-auto w-1/2"
                                placeholder="Nombre del Área"
                            />
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => duplicateArea(area.id)}><Copy className="w-4 h-4" /></Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => removeArea(area.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase text-slate-500">Sqft</Label>
                                <Input type="number" value={area.sqft} onChange={e => updateArea(area.id, { sqft: Number(e.target.value) })} className="h-9 text-sm bg-slate-50 border-slate-200" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase text-slate-500">Tipo Piso</Label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                                    value={area.floorType}
                                    onChange={e => updateArea(area.id, { floorType: e.target.value })}
                                >
                                    <option value="Carpet">Carpet</option>
                                    <option value="Hardwood">Hardwood</option>
                                    <option value="VCT">VCT / Tile</option>
                                </select>
                            </div>
                        </div>

                        {/* Fixtures Row */}
                        <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-3">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase text-blue-600">Toilets</Label>
                                <Input type="number" min="0" value={area.fixtures?.toilets || 0} onChange={e => updateArea(area.id, { fixtures: { ...area.fixtures, toilets: Number(e.target.value) } })} className="h-9 text-sm bg-blue-50 border-blue-100 text-blue-900 font-bold" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase text-blue-600">Urinals</Label>
                                <Input type="number" min="0" value={area.fixtures?.urinals || 0} onChange={e => updateArea(area.id, { fixtures: { ...area.fixtures, urinals: Number(e.target.value) } })} className="h-9 text-sm bg-blue-50 border-blue-100 text-blue-900 font-bold" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase text-blue-600">Sinks</Label>
                                <Input type="number" min="0" value={area.fixtures?.sinks || 0} onChange={e => updateArea(area.id, { fixtures: { ...area.fixtures, sinks: Number(e.target.value) } })} className="h-9 text-sm bg-blue-50 border-blue-100 text-blue-900 font-bold" />
                            </div>
                        </div>
                    </div>
                ))}

                <Button onClick={handleAddArea} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 border-dashed h-12 shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> Agregar Nueva Área
                </Button>
            </div>
        </div>
    );
}
