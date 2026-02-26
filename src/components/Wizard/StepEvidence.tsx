"use client";
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';

export default function StepEvidence() {
    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Paso 8: Evidencia & Notas Finales</CardTitle>
                <CardDescription className="text-slate-400">Sube fotos del sitio y redacta el sumario ejecutivo post-walkthrough.</CardDescription>
            </div>
        </div>
    );
}
