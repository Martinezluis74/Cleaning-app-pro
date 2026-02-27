"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepBathroomsProfile() {
    const { state, updateSite } = useWizard();

    return (
        <div className="space-y-8 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">Paso 4: Auditoría de Baños</CardTitle>
                <CardDescription className="text-black font-medium text-lg">
                    Ingresa el recuento exacto de cuartos de baño y sus accesorios. Estos aportarán minutos adicionales al cálculo base de labor.
                </CardDescription>
            </div>

            <div className="space-y-4">
                <Label className="text-black font-black uppercase tracking-widest text-lg border-b-2 border-black pb-2 block">
                    Desglose de Baños y Accesorios
                </Label>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 p-5 bg-white border-2 border-black rounded-xl shadow-sm">
                    {[
                        { id: 'rooms', label: 'Total Bathrooms' },
                        { id: 'toilets', label: 'Toilets' },
                        { id: 'urinals', label: 'Urinales' },
                        { id: 'sinks', label: 'Lavamanos' },
                        { id: 'showers', label: 'Duchas' }
                    ].map((fix) => (
                        <div key={fix.id} className="space-y-2">
                            <Label className="text-sm font-black uppercase text-black whitespace-nowrap">{fix.label}</Label>
                            <Input
                                type="number" min="0"
                                value={state.site.fixtures?.[fix.id as keyof typeof state.site.fixtures] || 0}
                                onChange={e => updateSite({
                                    fixtures: {
                                        ...(state.site.fixtures || { rooms: 0, toilets: 0, urinals: 0, sinks: 0, showers: 0 }),
                                        [fix.id]: Number(e.target.value)
                                    }
                                })}
                                className="h-16 text-center text-3xl bg-white border-2 border-black shadow-sm font-black text-black focus-visible:ring-black"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
