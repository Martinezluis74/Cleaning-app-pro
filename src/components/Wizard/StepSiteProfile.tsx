"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StepSiteProfile() {
    const { state, updateSite } = useWizard();

    const safeSqft = typeof state.site.sqft === 'number' && !isNaN(state.site.sqft) ? state.site.sqft : 0;

    return (
        <div className="space-y-8 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">Paso 2: Perfil Base del Edificio</CardTitle>
                <CardDescription className="text-black font-medium text-lg">
                    Ingresa los datos fundamentales del sitio. Asegúrate de proporcionar el área total exacta.
                </CardDescription>
            </div>

            <div className="space-y-8">
                {/* BUILDING CLASS & FREQUENCY & TSQFT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-white border-2 border-black rounded-xl shadow-sm">
                    <div className="space-y-2">
                        <Label className="text-black font-bold uppercase tracking-widest text-lg">Total SqFt del Edificio</Label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="Ej. 5000"
                            value={safeSqft || 0}
                            onChange={e => updateSite({ sqft: Number(e.target.value) || 0 })}
                            className="bg-white border-2 border-black text-black text-xl font-black h-12 shadow-sm focus-visible:ring-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-black font-bold uppercase tracking-widest text-lg">Cantidad de Escritorios</Label>
                        <Input
                            type="number" min="0" placeholder="Ej. 15"
                            value={state.site.desks || 0}
                            onChange={e => updateSite({ desks: Number(e.target.value) || 0 })}
                            className="bg-white border-2 border-black text-black text-xl font-black h-12 shadow-sm focus-visible:ring-black"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-black font-bold uppercase tracking-widest text-lg">Cantidad de Personas</Label>
                        <Input
                            type="number" min="0" placeholder="Ej. 20"
                            value={state.site.people || 0}
                            onChange={e => updateSite({ people: Number(e.target.value) || 0 })}
                            className="bg-white border-2 border-black text-black text-xl font-black h-12 shadow-sm focus-visible:ring-black"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-black font-bold uppercase tracking-widest text-lg">Cantidad de Canecas</Label>
                        <Input
                            type="number" min="0" placeholder="Ej. 10"
                            value={state.site.trashCans || 0}
                            onChange={e => updateSite({ trashCans: Number(e.target.value) || 0 })}
                            className="bg-white border-2 border-black text-black text-xl font-black h-12 shadow-sm focus-visible:ring-black"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-black font-bold uppercase tracking-widest text-lg">Frecuencia Semanal</Label>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                <button
                                    key={num}
                                    onClick={() => updateSite({ cleaningFrequency: num })}
                                    className={`w-12 h-12 rounded-full font-black text-xl transition-all ${state.site.cleaningFrequency === num
                                        ? 'bg-black text-white shadow-lg scale-105 border-2 border-black'
                                        : 'bg-white border-2 border-black text-black hover:bg-slate-200'
                                        }`}
                                >
                                    {num}x
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
