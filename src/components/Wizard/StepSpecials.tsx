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
        <div className="space-y-6 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">Paso 6: Servicios Especiales</CardTitle>
                <CardDescription className="text-black font-medium text-lg">
                    Calcula upsells (Limpieza de alfombras, vidrios, etc) para incrementar el valor del ticket.
                </CardDescription>
            </div>

            <div className="space-y-4">
                {state.addons.map(addon => (
                    <div key={addon.id} className="p-5 border-2 border-black rounded-xl bg-white shadow-sm flex justify-between items-center">
                        <div>
                            <div className="font-black text-xl text-black">{addon.name}</div>
                            <div className="text-lg font-bold text-black mt-1">
                                {addon.frequency} - Interés: {addon.clientInterest} - {addon.sqft} sqft
                            </div>
                        </div>
                        <Button size="lg" variant="outline" className="text-white bg-black border-2 border-black hover:bg-slate-800" onClick={() => removeAddon(addon.id)}>
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                ))}

                <Button onClick={() => handleAddAddon('Carpet Extraction')} className="w-full bg-white hover:bg-slate-200 text-black font-black text-lg border-2 border-black border-dashed h-16 shadow-sm">
                    <Plus className="w-6 h-6 mr-2" /> Sugerir Upsell (Ej. Carpet Extraction)
                </Button>
            </div>
        </div>
    );
}
