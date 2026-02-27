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
        <div className="space-y-6 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">
                    {stepNum === 3 ? 'Paso 3: Áreas Principales' : 'Paso 5: Inventario por Área'}
                </CardTitle>
                <CardDescription className="text-black font-medium text-lg">
                    Añade zonas, especifica metros cuadrados, tipo de piso y cuenta exacta de accesorios.
                </CardDescription>
            </div>

            <div className="space-y-6">
                {state.areas.map((area, index) => (
                    <div key={area.id} className="p-5 border-2 border-black rounded-2xl bg-white shadow-sm space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b-2 border-black">
                            <Input
                                value={area.name}
                                onChange={e => updateArea(area.id, { name: e.target.value })}
                                className="font-black text-2xl text-black border-0 shadow-none focus-visible:ring-0 p-0 h-auto w-1/2"
                                placeholder="Nombre del Área"
                            />
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-black font-bold border-2 border-black hover:bg-slate-200" onClick={() => duplicateArea(area.id)}>
                                    <Copy className="w-4 h-4 mr-1" /> Copiar
                                </Button>
                                <Button size="sm" variant="outline" className="text-white bg-black font-bold border-2 border-black hover:bg-slate-800" onClick={() => removeArea(area.id)}>
                                    <Trash2 className="w-4 h-4 mr-1" /> Borrar
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <Label className="text-sm font-black uppercase text-black">Sqft</Label>
                                <Input type="number" value={area.sqft} onChange={e => updateArea(area.id, { sqft: Number(e.target.value) })} className="h-12 text-lg font-black bg-white border-2 border-black text-black focus-visible:ring-black" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-sm font-black uppercase text-black">Tipo Piso</Label>
                                <select
                                    className="flex h-12 w-full rounded-md border-2 border-black bg-white px-3 py-1 text-lg font-black text-black shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
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
                        <div className="grid grid-cols-3 gap-4 border-t-2 border-black pt-3 mt-3">
                            <div className="space-y-1">
                                <Label className="text-xs font-black uppercase text-black">Toilets</Label>
                                <Input type="number" min="0" value={area.fixtures?.toilets || 0} onChange={e => updateArea(area.id, { fixtures: { ...area.fixtures, toilets: Number(e.target.value) } })} className="h-10 text-lg font-black bg-white border-2 border-black text-black focus-visible:ring-black" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-black uppercase text-black">Urinals</Label>
                                <Input type="number" min="0" value={area.fixtures?.urinals || 0} onChange={e => updateArea(area.id, { fixtures: { ...area.fixtures, urinals: Number(e.target.value) } })} className="h-10 text-lg font-black bg-white border-2 border-black text-black focus-visible:ring-black" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-black uppercase text-black">Sinks</Label>
                                <Input type="number" min="0" value={area.fixtures?.sinks || 0} onChange={e => updateArea(area.id, { fixtures: { ...area.fixtures, sinks: Number(e.target.value) } })} className="h-10 text-lg font-black bg-white border-2 border-black text-black focus-visible:ring-black" />
                            </div>
                        </div>
                    </div>
                ))}

                <Button onClick={handleAddArea} className="w-full bg-white hover:bg-slate-200 text-black font-black border-2 border-black border-dashed h-16 text-lg shadow-sm">
                    <Plus className="w-6 h-6 mr-2" /> Agregar Nueva Área
                </Button>
            </div>
        </div>
    );
}
