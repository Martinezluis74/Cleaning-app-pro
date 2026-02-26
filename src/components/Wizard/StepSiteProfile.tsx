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
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Paso 2: Perfil del Sitio</CardTitle>
                <CardDescription className="text-slate-400">Horarios, frecuencia y metros cuadrados totales.</CardDescription>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-slate-300 font-bold uppercase tracking-widest text-xs">Frecuencia de Limpieza</Label>
                    <Select value={state.site.cleaningFrequency} onValueChange={v => updateSite({ cleaningFrequency: v })}>
                        <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                            <SelectValue placeholder="Seleccione Frecuencia" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="Daily">Diario (5x)</SelectItem>
                            <SelectItem value="Weekly">Semanal (1x)</SelectItem>
                            <SelectItem value="Bi-Weekly">Quincenal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
