"use client";
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';

export default function StepScope() {
    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Paso 5: Alcance del Servicio</CardTitle>
                <CardDescription className="text-slate-500">Selecciona el modo de cálculo (Rápido vs Detallado).</CardDescription>
            </div>

            <div className="p-8 border border-slate-200 rounded-xl bg-slate-50 text-center text-slate-500 shadow-inner">
                <p>Configuración de reglas de alcance (Feature Proxy)</p>
            </div>
        </div>
    );
}
