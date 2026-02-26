"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepClientProfile() {
    const { state, updateClient } = useWizard();
    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Paso 1: Perfil del Cliente</CardTitle>
                <CardDescription className="text-slate-400">Datos básicos de la empresa y contacto.</CardDescription>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-slate-300 font-bold uppercase tracking-widest text-xs">Empresa</Label>
                    <Input
                        value={state.client.company}
                        onChange={e => updateClient({ company: e.target.value })}
                        className="bg-slate-950 border-slate-800 text-white"
                        placeholder="Ej. Acme Corp"
                    />
                </div>
                {/* ... more fields ... */}
            </div>
        </div>
    );
}
