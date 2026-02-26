"use client";
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWizard } from '@/context/WizardContext';

export default function StepEvidence() {
    const { state, updateEvidence } = useWizard();
    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Paso 8: Evidencia y Notas</CardTitle>
                <CardDescription className="text-slate-500">Adjunta fotos y notas finales del walkthrough.</CardDescription>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs">Notas Generales</Label>
                    <Textarea
                        value={state.evidence.walkthroughNotes}
                        onChange={e => updateEvidence({ walkthroughNotes: e.target.value })}
                        className="bg-white border-slate-300 text-slate-900 min-h-[120px] shadow-sm"
                        placeholder="Observaciones importantes del sitio..."
                    />
                </div>
            </div>
        </div>
    );
}
