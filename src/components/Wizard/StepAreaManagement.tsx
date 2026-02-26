"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Trash2 } from 'lucide-react';
import type { Area } from '@/types/wizard';

export default function StepAreaManagement({ stepNum }: { stepNum: number }) {
    const { state, addArea, duplicateArea, removeArea } = useWizard();

    const handleAddArea = () => {
        const newArea: Area = {
            id: crypto.randomUUID(),
            name: 'Nueva Área',
            sqft: 1000,
            floorType: 'Carpet',
            inventory: []
        };
        addArea(newArea);
    };

    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                    {stepNum === 3 ? 'Paso 3: Áreas Principales' : 'Paso 4: Inventario por Área'}
                </CardTitle>
                <CardDescription className="text-slate-400">
                    Añade zonas, especifica metros cuadrados y define el inventario (baños, etc).
                </CardDescription>
            </div>

            <div className="space-y-4">
                {state.areas.map((area, index) => (
                    <div key={area.id} className="p-4 border border-slate-800 rounded-xl bg-slate-950 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-white">{area.name}</div>
                            <div className="text-sm text-slate-400">{area.sqft} sqft - {area.inventory.length} items inventario</div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-blue-400 border-blue-900 hover:bg-blue-900/50" onClick={() => duplicateArea(area.id)}><Copy className="w-4 h-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-400 border-red-900 hover:bg-red-900/50" onClick={() => removeArea(area.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    </div>
                ))}

                <Button onClick={handleAddArea} className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 border-dashed">
                    <Plus className="w-4 h-4 mr-2" /> Agregar Nueva Área
                </Button>
            </div>
        </div>
    );
}
