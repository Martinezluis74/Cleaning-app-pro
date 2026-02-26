"use client";
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';

export default function StepCompliance() {
    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Paso 7: Compliance & Acceso</CardTitle>
                <CardDescription className="text-slate-400">Alarmas, protocolos de seguridad y certificaciones requeridas.</CardDescription>
            </div>
        </div>
    );
}
