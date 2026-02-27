"use client";
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';

export default function StepScope() {
    return (
        <div className="space-y-6 bg-white">
            <div>
                <CardTitle className="text-3xl font-black text-black mb-2">Paso 5: Alcance del Servicio</CardTitle>
                <CardDescription className="text-black font-medium text-lg">Selecciona el modo de cálculo (Rápido vs Detallado).</CardDescription>
            </div>

            <div className="p-8 border-2 border-black rounded-xl bg-white text-center text-black shadow-sm font-bold text-lg">
                <p>Configuración de reglas de alcance (Feature Proxy)</p>
            </div>
        </div>
    );
}
