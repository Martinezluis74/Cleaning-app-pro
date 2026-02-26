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
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Paso 2: Perfil del Sitio</CardTitle>
                <CardDescription className="text-slate-500">Horarios, frecuencia, áreas y clase del edificio.</CardDescription>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs">Clase del Edificio (Producción)</Label>
                    <Select value={state.site.buildingClass} onValueChange={(v: any) => updateSite({ buildingClass: v })}>
                        <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                            <SelectValue placeholder="Seleccione Clase" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                            <SelectItem value="A">Clase A (Alto tránsito/Prestigio - 2000 sqft/hr)</SelectItem>
                            <SelectItem value="B">Clase B (Estándar médico/oficina - 2500 sqft/hr)</SelectItem>
                            <SelectItem value="C">Clase C (Industrial/Básico - 3000 sqft/hr)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs">Frecuencia de Limpieza</Label>
                    <Select value={state.site.cleaningFrequency} onValueChange={v => updateSite({ cleaningFrequency: v })}>
                        <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                            <SelectValue placeholder="Seleccione Frecuencia" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
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
