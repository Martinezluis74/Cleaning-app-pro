"use client";
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepClientProfile() {
    const { state, updateClient } = useWizard();
    return (
        <div className="space-y-6 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">Paso 1: Perfil del Cliente</CardTitle>
                <CardDescription className="text-black font-medium text-lg">Datos básicos de la empresa y contacto.</CardDescription>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-black font-bold uppercase tracking-widest text-lg">Empresa</Label>
                    <Input
                        value={state.client.company}
                        onChange={e => updateClient({ company: e.target.value })}
                        className="bg-white border-2 border-black text-black font-bold text-lg h-12 shadow-sm"
                        placeholder="Ej. Acme Corp"
                    />
                </div>
                {/* ... more fields ... */}
            </div>
        </div>
    );
}
