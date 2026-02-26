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
                <Button onClick={() => handleAddAddon('Carpet Extraction')} className="bg-blue-900/40 text-blue-300 hover:bg-blue-800/60 border border-blue-800">
                    <Plus className="w-4 h-4 mr-2" /> Agregar Alfombras
                </Button>
                <Button onClick={() => handleAddAddon('Floor Scrub')} className="bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60 border border-emerald-800">
                    <Plus className="w-4 h-4 mr-2" /> Agregar Pisos Duros
                </Button>
                <Button onClick={() => handleAddAddon('Window Cleaning')} className="bg-cyan-900/40 text-cyan-300 hover:bg-cyan-800/60 border border-cyan-800">
                    <Plus className="w-4 h-4 mr-2" /> Agregar Vidrios
                </Button>
            </div>

            <div className="space-y-4">
                {state.addons.map(addon => (
                    <div key={addon.id} className="p-4 border border-slate-800 rounded-xl bg-slate-950 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-white text-lg">{addon.name}</div>
                            <div className="text-sm text-slate-400 flex gap-4 mt-1">
                                <span className="text-blue-400">{addon.frequency}</span>
                                <span className="text-amber-500">Interest: {addon.clientInterest}</span>
                                <span>{addon.sqft} sqft</span>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-red-400 border-red-900 hover:bg-red-900/50" onClick={() => removeAddon(addon.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}

                {state.addons.length === 0 && (
                    <div className="text-center p-8 border border-dashed border-slate-800 rounded-xl text-slate-500">
                        No has ofrecido Add-ons. Un upsell promedio incrementa el contrato anual en 15%.
                    </div>
                )}
            </div>
        </div>
    );
}
