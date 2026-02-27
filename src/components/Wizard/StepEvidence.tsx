"use client";
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWizard } from '@/context/WizardContext';

export default function StepEvidence() {
    const { state, updateEvidence } = useWizard();
    return (
        <div className="space-y-6 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">Paso 8: Evidencia y Notas</CardTitle>
                <CardDescription className="text-black font-medium text-lg">Adjunta fotos y notas finales del walkthrough.</CardDescription>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-black font-bold uppercase tracking-widest text-lg">Notas Generales</Label>
                    <Textarea
                        value={state.evidence.walkthroughNotes}
                        onChange={e => updateEvidence({ walkthroughNotes: e.target.value })}
                        className="bg-white border-2 border-black text-black font-bold text-lg min-h-[160px] shadow-sm p-4 focus-visible:ring-black"
                        placeholder="Observaciones importantes del sitio..."
                    />
                </div>
            </div>
        </div>
    );
}
