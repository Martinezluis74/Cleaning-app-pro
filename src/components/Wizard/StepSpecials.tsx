"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { Addon } from '@/types/wizard';

export default function StepSpecials() {
    const { state, addAddon, removeAddon } = useWizard();

    const handleAddAddon = (type: string) => {
        const newAddon: Addon = {
            id: crypto.randomUUID(),
            name: type,
            frequency: 'One-time',
            clientInterest: 'Warm',
            sqft: 500
        };
        addAddon(newAddon);
    };

    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Paso 6: Add-ons & Servicios Especiales</CardTitle>
                <CardDescription className="text-slate-400">
                    Calcula upsells (Limpieza de alfombras, vidrios, etc) para incrementar el valor del ticket.
                </CardDescription>
            </div>

            <div className="flex gap-4 mb-6">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Paso 6: Servicios Especiales</CardTitle>
                <CardDescription className="text-slate-500">Add-ons y servicios adicionales (Upsells).</CardDescription>
            </div>

            <div className="space-y-4">
                {state.addons.map(addon => (
                    <div key={addon.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm flex justify-between items-center">
                        <div>
                            <div className="font-bold text-slate-900">{addon.name}</div>
                            <div className="text-sm text-slate-500">
                                {addon.frequency} - Interés: {addon.clientInterest} - {addon.sqft} sqft
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => removeAddon(addon.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}

                <Button onClick={() => handleAddAddon('Carpet Extraction')} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 border-dashed">
                    <Plus className="w-4 h-4 mr-2" /> Sugerir Upsell (Ej. Carpet Extraction)
                </Button>
            </div>
        </div>
    );
}
