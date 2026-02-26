"use client";
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';

export default function StepScope() {
    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Paso 5: Alcance del Servicio</CardTitle>
                <CardDescription className="text-slate-400">Selecciona el modo de cálculo (Rápido vs Detallado).</CardDescription>
            </div>

            <div className="p-8 border border-slate-800 rounded-xl bg-slate-950 text-center text-slate-400">
                <p>Configuración de reglas de alcance (Feature Proxy)</p>
            </div>
        </div>
    );
}
